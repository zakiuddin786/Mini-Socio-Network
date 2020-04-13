import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post-model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
// import {post} from '../../../backend/models/post.js'; 

@Injectable({providedIn:'root'})
export class PostsService{
    private posts : Post[]=[];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http:HttpClient,private router:Router){}

    getPosts()
    {
        this.http
        .get<{message:string,posts:any}>(
            "http://localhost:3000/api/posts"
            )
        .pipe(map((postData)=>{
            return postData.posts.map(post=>{
                return{
                    title:post.title,
                    content:post.content,
                    id:post._id
                };
            });
        }))
        .subscribe((modifiedPost)=>{
            this.posts=modifiedPost;
            this.postsUpdated.next([...this.posts]);
        });
    }

    getPost(id:string){
        console.log('fetching from post db');
        return this.http.get
        <{_id:string, title:string,content:string}>
        ("http://localhost:3000/api/posts/"+id);
        // 
        // return { ...this.posts.find(p => p.id === id) };
    //    return post.findById(id).then(post=>{
    //         console.log("fetching from DB!");
    //         if(post){
    //             res.status(200).json(post);
    //         }
    //         else{
    //             console.log("Error Post Not Found!!");
    //             res.status(404).json({
    //                 message:"Post Not Found!!"
    //             });
    //         }
    //     })
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    addPosts(title :string,content:string){
        const post:Post={id:null,title:title,content:content};
        this.http
        .post<{message:string,postId:string}>(
            "http://localhost:3000/api/posts",post)
        .subscribe(responseData =>{
            console.log(responseData.message);
            const id=responseData.postId;
            post.id=id;
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
            this.router.navigate(["/"]);
        })
    }

    updatePost(id:string,title:string,content:string){
        const post:Post ={id:id, title:title, content:content};
        this.http.put("http://localhost:3000/api/posts/"+id,post)
        .subscribe(response => {
            // console.log(response)
            console.log("Updating in progress....");
            const updatedPosts=[...this.posts];
            const oldPostIndex = updatedPosts.findIndex(p=>p.id===post.id);
            updatedPosts[oldPostIndex]=post;
            this.posts=updatedPosts;
            this.postsUpdated.next([...this.posts]);
            this.router.navigate(["/"]);
        });
    }
 
    deletePost(id:string){
        this.http.delete("http://localhost:3000/api/posts/"+id)
        .subscribe(()=>{
            console.log("deleted!!!");
            const updatedPosts=this.posts.filter(post=>post.id!==id);
            this.posts=updatedPosts;
            this.postsUpdated.next([...this.posts]);
        })
    }
}