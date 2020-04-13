import {Component, OnInit} from '@angular/core';
import{ FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute, ParamMap  } from '@angular/router';

import { PostsService } from '../posts.service';
import { Post } from '../post-model';
import { validateHorizontalPosition } from '@angular/cdk/overlay';

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
    form:FormGroup;
    imagePreview:string;

    constructor(public postService:PostsService, public route : ActivatedRoute){}
    
    ngOnInit(){
        this.form=new FormGroup({
            title:new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]}),
            content:new FormControl(null,{validators:[Validators.required]}),
            image:new FormControl(null,{validators:[Validators.required]})
        });
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
                this.form.setValue({
                    title:this.post.title,
                    content:this.post.content
                });
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
    
    onImagePicked(event:Event)
    {
        const file =(event.target as HTMLInputElement).files[0];
        this.form.patchValue({image:file});
        this.form.get('image').updateValueAndValidity();
        const reader=new FileReader();
        reader.onload=()=>{
            this.imagePreview=reader.result;
            // console.log(this.imagePreview+"imgae");
        };
        reader.readAsDataURL(file);
        // console.log(this.imagePreview);
        // console.log(file);
        // console.log(this.form);
    }

    onSavePost(){
        if(this.form.invalid){
        return;
        }
        this.isLoading=true;
        if(this.mode==='create'){
            console.log("on create page!");
            this.postService.addPosts(this.form.value.title,this.form.value.content);
        }
        else{
            console.log("on Update page!");
            this.postService.updatePost(
                this.postId,
                this.form.value.title,
                this.form.value.content
            );
        }
        // this.postService.addPosts(form.value.title,form.value.content);
            this.form.reset();
        }
}