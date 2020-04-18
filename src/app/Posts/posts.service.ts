import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post-model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
// import {post} from '../../../backend/models/post.js'; 
import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl+"/posts/";

@Injectable({providedIn:'root'})
export class PostsService{
    private posts : Post[]=[];
    private postsUpdated = new Subject<{posts:Post[],postCount:number}>();

    constructor(private http:HttpClient,private router:Router){}

    getPosts(postPerPage:number,currentPage:number)
    {
        const queryParams=`?pagesize=${postPerPage}&page=${currentPage}`;
        this.http
        .get<{message:string,posts:any,maxPosts:number}>(
            BACKEND_URL+queryParams
            )
        .pipe(map((postData)=>{
            return {posts: postData.posts.map(post=>{
                return{
                    title:post.title,
                    content:post.content,
                    id:post._id,
                    imagePath:post.imagePath,
                    creator:post.creator
                };
                }),
                maxPosts:postData.maxPosts
            };
        }))
        .subscribe((modifiedPostData)=>{
            console.log(modifiedPostData);
            
            this.posts=modifiedPostData.posts;
            this.postsUpdated.next({
                posts:[...this.posts],
                postCount:modifiedPostData.maxPosts
            });
        });
    }

    getPost(id:string){
        console.log('fetching from post db');
        return this.http.get
        <{
            _id:string,
             title:string,
             content:string,
             imagePath:string,
             creator:string
         }>
        (BACKEND_URL+id);
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
            BACKEND_URL,postData)
        .subscribe(responseData =>{
            // const post:Post ={
            //     id:responseData.post.id,
            //     title:title,
            //     content:content,
            //     imagePath:responseData.post.imagePath
            // };
            // console.log(responseData.message);
            // // const id=responseData.postId;
            // // post.id=id;
            // this.posts.push(post);
            // this.postsUpdated.next([...this.posts]);
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
                imagePath:image,
                creator:null
            };
        }        
        this.http.put(BACKEND_URL+id,postData)
        .subscribe(response => {
            // console.log(response)
            console.log("Updating in progress....");
            // const updatedPosts=[...this.posts];
            // const oldPostIndex = updatedPosts.findIndex(p=>p.id===id);
            // const post:Post ={
            //     id:id, 
            //     title:title,
            //     content:content,
            //     imagePath:""
            // };
            // updatedPosts[oldPostIndex]=post;
            // this.posts=updatedPosts;
            // this.postsUpdated.next([...this.posts]);
            this.router.navigate(["/"]);
        });
    }
 
    deletePost(id:string){
         return this.http.delete(BACKEND_URL+id)
        // .subscribe(()=>{
        //     console.log("del eted!!!");
        //     const updatedPosts=this.posts.filter(post=>post.id!==id);
        //     this.posts=updatedPosts;
        //     this.postsUpdated.next([...this.posts]);
        // })
    }
}