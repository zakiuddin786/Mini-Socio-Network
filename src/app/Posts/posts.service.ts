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
                    id:post._id,
                    imagePath:post.imagePath
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
        <{
            _id:string,
             title:string,
             content:string,
             imagePath:string
         }>
        ("http://localhost:3000/api/posts/"+id);
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    addPosts(title :string,content:string,image:File){
        const postData=new FormData();
        postData.append("title",title);
        postData.append("content",content);
        postData.append("image",image,title);
        // const post:Post={id:null,title:title,content:content};
        this.http
        .post<{message:string,post: Post}>(
            "http://localhost:3000/api/posts",postData)
        .subscribe(responseData =>{
            const post:Post ={
                id:responseData.post.id,
                title:title,
                content:content,
                imagePath:responseData.post.imagePath
            };
            console.log(responseData.message);
            // const id=responseData.postId;
            // post.id=id;
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
            this.router.navigate(["/"]);
        })
    }

    updatePost(id:string,title:string,content:string,image:File | string){
        let postData: Post | FormData;
        if(typeof(image)==='object'){
            postData=new FormData();
            postData.append("id",id);
            postData.append("title",title);
            postData.append("content",content);
            postData.append("image",image,title);

        }else{
            postData={
                id:id, 
                title:title,
                content:content,
                imagePath:image
            };
        }        
        this.http.put("http://localhost:3000/api/posts/"+id,postData)
        .subscribe(response => {
            // console.log(response)
            console.log("Updating in progress....");
            const updatedPosts=[...this.posts];
            const oldPostIndex = updatedPosts.findIndex(p=>p.id===id);
            const post:Post ={
                id:id, 
                title:title,
                content:content,
                imagePath:""
            };
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