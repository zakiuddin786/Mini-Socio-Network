import { Component , OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs'

import { Post } from '../post-model'; 
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material';

@Component({
    selector:"app-post-list",
    templateUrl:"./post-list.component.html",
    styleUrls:["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy{
    posts:Post[]=[];
    private postSub:Subscription;
    isLoading=false;
    totalPosts=10;
    postsPerPage=2;
    pageSizeOptions=[1,2,5,10,15,20];
    

    constructor(public postService: PostsService){}
    ngOnInit()
    {
    this.isLoading=true;
       this.postService.getPosts();
       this.postSub= this.postService.getPostUpdateListener()
        .subscribe((posts: Post[] )=>{
            this.isLoading=false;
            this.posts=posts;
        });
    }
    onPageChanged(pageData:PageEvent){
        console.log(pageData);
    }
    
    onDelete(postId:string)
    {
        this.postService.deletePost(postId);
    }

    ngOnDestroy(){
        this.postSub.unsubscribe(); 
    }
}