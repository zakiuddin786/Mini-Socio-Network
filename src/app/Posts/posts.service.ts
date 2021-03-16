import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post-model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import * as moment from 'moment';
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
        .get<any>(
            BACKEND_URL+"getAllPosts"+queryParams
            )
        .pipe(map((postData)=>{
            return {posts: postData.posts.map(post=>{
            // console.log(post)

                return{
                    title:post.title,
                    content:post.content,
                    id:post._id,
                    imagePath:post.imagePath,
                    user:post.creator,
                    name:post.creatorName,
                    likes:post.likes,
                    comments:post.comments,
                    date:moment(post.date).format("MM/DD/YYYY"),
                    avatar:post.avatar
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
        // return this.get<any>(BACKEND_URL+id);
        return this.http.get
        <any>(BACKEND_URL+"getPost/"+id);
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    addPost(title :string,content:string,image:File){
        const postData=new FormData();
        postData.append("title",title);
        postData.append("content",content);
        postData.append("image",image,title);
        this.http
        .post<{message:string,post: Post}>(
            BACKEND_URL+"createPost",postData)
        .subscribe(responseData =>{
            this.router.navigate(["/"]);
        })
    }

    updatePost(id:string,title:string,content:string,image:File | string){
        let postData: any | Post | FormData;
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
                user:null,
                name:null
            };
        }
        this.http.put(BACKEND_URL+"updatePost/"+id,postData)
        .subscribe(response => {
            console.log("Updating in progress....");
            this.router.navigate(["/"]);
        });
    }

    deletePost(id:string){
         return this.http.delete(BACKEND_URL+"deletePost/"+id)
    }

    likePost(id:string){
        return this.http.post(BACKEND_URL+"like/"+id,id)
   }

   unlikePost(id:string){
    return this.http.put(BACKEND_URL+"unlike/"+id,id)
    }

    comment(id:string,text:string){
        const comment ={
            text:text
        };
        // comment.append("text",text);
    return this.http.post(BACKEND_URL+"deletePost/"+id,comment)
    }
}
