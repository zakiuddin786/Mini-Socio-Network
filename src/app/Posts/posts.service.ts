import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post-model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn:'root'})
export class PostsService{
    private posts : Post[]=[];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http:HttpClient){}

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
        return {...this.posts.find(p=>p.id===id)};
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    addPosts(title :string,content:string){
        const post:Post={id:null,title:title,content:content};
        this.http.post<{message:string,postId:string}>("http://localhost:3000/api/posts",post)
        .subscribe(responseData =>{
            console.log(responseData.message);
            const id=responseData.postId;
            post.id=id;
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
        })
    }

    updatePost(id:string,title:string,content:string){
        const post:Post ={id:id, title:title, content:content};
        this.http.put("http://localhost:3000/api/posts/"+id,post)
        .subscribe(response => console.log(response));
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