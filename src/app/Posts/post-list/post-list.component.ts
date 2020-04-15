import { Component , OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs'

import { Post } from '../post-model'; 
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector:"app-post-list",
    templateUrl:"./post-list.component.html",
    styleUrls:["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy{
    posts:Post[]=[];
    private postSub:Subscription;
    isLoading=false;
    totalPosts=0;
    postsPerPage=2;
    currentPage=1;
    userId:string;

    pageSizeOptions=[1,2,5,10,15,20];
    private authStatusSubs : Subscription;
    userIsAuthenticated=false;

    constructor(public postService: PostsService ,private authService:AuthService){}

    ngOnInit()
    {
       this.isLoading=true;
    
       this.userIsAuthenticated=this.authService.isAuth();
       this.userId=this.authService.getUserId();

       this.authStatusSubs=this.authService
       .getAuthStatusListener()
       .subscribe(isAuthenticated=>{
           this.userIsAuthenticated=isAuthenticated;
           this.userId=this.authService.getUserId();

       });
       this.postService.getPosts(this.postsPerPage,this.currentPage);
       this.postSub= this.postService.getPostUpdateListener()
        .subscribe((postData:{posts: Post[],postCount : number} )=>{
            this.isLoading=false;
            this.totalPosts=postData.postCount;
            this.posts=postData.posts;
        });


    }
    onPageChanged(pageData:PageEvent){
       this.isLoading=true;
        this.currentPage=pageData.pageIndex+1;
        this.postsPerPage=pageData.pageSize;
       this.postService.getPosts(this.postsPerPage,this.currentPage);
        console.log(pageData);
    }
    
    onDelete(postId:string)
    {
        this.isLoading=true;
        this.postService.deletePost(postId).subscribe(()=>{
        this.postService.getPosts(this.postsPerPage,this.currentPage);
        });
    }

    ngOnDestroy(){
        this.postSub.unsubscribe(); 
        this.authStatusSubs.unsubscribe();
    }
}