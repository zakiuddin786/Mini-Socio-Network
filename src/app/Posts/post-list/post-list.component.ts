import { Component , OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs'

import { Post } from '../post-model'; 
import { PostsService } from '../posts.service';

@Component({
    selector:"app-post-list",
    templateUrl:"./post-list.component.html",
    styleUrls:["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy{
    // posts=[
    //     {
    //     title:"first post",
    //     content:"first post content"
    //     },
    //     {
    //         title:"second post",
    //         content:"second post content"
    //     },
    //     {
    //         title:"third post",
    //         content:"third post content"
    //     }
    // ];
    posts:Post[]=[];
    private postSub:Subscription;

    constructor(public postService: PostsService){}
    ngOnInit()
    {
        this.posts=this.postService.getPosts();
       this.postSub= this.postService.getPostUpdateListener()
        .subscribe((posts: Post[] )=>{
            this.posts=posts;
        });
    }

    ngOnDestroy(){
        this.postSub.unsubscribe(); 
    }
}