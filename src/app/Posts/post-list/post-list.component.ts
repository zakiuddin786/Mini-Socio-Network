import { Component , Input} from '@angular/core';

import { Post } from '../post-model'; 
import { PostsService } from '../posts.service';

@Component({
    selector:"app-post-list",
    templateUrl:"./post-list.component.html",
    styleUrls:["./post-list.component.css"]
})
export class PostListComponent{
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
    @Input() posts:Post[]=[]

    constructor(public postService: PostsService){}
}