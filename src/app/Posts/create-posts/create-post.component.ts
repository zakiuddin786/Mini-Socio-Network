import {Component, OnInit} from '@angular/core';
import{ NgForm } from '@angular/forms';
import {ActivatedRoute, ParamMap  } from '@angular/router';

import { PostsService } from '../posts.service';
import { Post } from '../post-model';

@Component({
    selector:'app-create-post',
    templateUrl:"./create-post.component.html",
    styleUrls:["./create-post.component.css"]
})
export class CreatePostComponent implements OnInit{

    post:Post;
    isLoading=false;
    private mode = "create";
    private postId:string;

    constructor(public postService:PostsService, public route : ActivatedRoute){}
    
    ngOnInit(){
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
        if(paramMap.has('postId')){
        
            this.mode="edit";
            this.postId=paramMap.get('postId');
            this.isLoading=true;
            console.log(this.isLoading);
            this.postService.getPost(this.postId).subscribe(postData =>{
                this.isLoading=false;
            console.log(this.isLoading+"after vvd loaad");

                this.post ={
                id:postData._id,
                title:postData.title,
                content:postData.content};
            });
            console.log(this.isLoading+"after loaad");

            // this.post=this.postService.getPost(this.postId);
            // console.log(this.post.content);
        }
        else{
            this.mode="create";
            this.postId=null;
        }
    });
    }

    onSavePost(form : NgForm){
        if(form.invalid){
        return;
        }
        this.isLoading=true;
        if(this.mode==='create'){
            console.log("on create page!");
            this.postService.addPosts(form.value.title,form.value.content);
        }
        else{
            console.log("on Update page!");
            this.postService.updatePost(
                this.postId,
                form.value.title,
                form.value.content
            );
        }
        // this.postService.addPosts(form.value.title,form.value.content);
            form.resetForm();
        }
}