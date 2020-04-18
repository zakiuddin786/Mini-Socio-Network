import {Component, OnInit, OnDestroy} from '@angular/core';
import{ FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute, ParamMap  } from '@angular/router';

import { PostsService } from '../posts.service';
import { Post } from '../post-model';
import { mimeType } from './mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
@Component({
    selector:'app-create-post',
    templateUrl:"./create-post.component.html",
    styleUrls:["./create-post.component.css"]
})
export class CreatePostComponent implements OnInit, OnDestroy{

    post:Post;
    isLoading=false;
    private mode = "create";
    private postId:string;
    form:FormGroup;
    imagePreview:any;
    authStatusSub: Subscription;

    constructor(public postService:PostsService,
         public route : ActivatedRoute,
         private authService : AuthService
         ){}
    
    ngOnInit(){
        this.authStatusSub=this.authService.getAuthStatusListener()
        .subscribe(
            authStatus =>{
                this.isLoading=false;
            }
        )
        this.form=new FormGroup({
            title:new FormControl(null,{
                 validators:[Validators.required,Validators.minLength(3)]
                }),
            content:new FormControl(null,{
                validators:[Validators.required]}),
            image:new FormControl(null,{
                validators:[Validators.required],
                asyncValidators:[mimeType]
            })
        });
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
        if(paramMap.has('postId')){
        
            this.mode="edit";
            this.postId=paramMap.get('postId');
            this.isLoading=true;
            this.postService.getPost(this.postId).subscribe(postData =>{
                this.isLoading=false;
                this.post ={
                id:postData._id,
                title:postData.title,
                content:postData.content,
                imagePath:postData.imagePath,
                creator:postData.creator
            };
                this.form.setValue({
                   'title':this.post.title,
                    'content':this.post.content,
                    image:this.post.imagePath
                });
            });
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
        };
        reader.readAsDataURL(file);
        console.log(this.form.value.title);
        console.log(this.form.value.content);

        console.log(this.form);
    }

    onSavePost(){
        if(this.form.invalid){
            console.log(this.form);
            console.log('invalid post');
        return;
        }
        this.isLoading=true;
        if(this.mode==='create'){
            console.log("on create page!");
            this.postService.addPosts(
                this.form.value.title,
                this.form.value.content,
                this.form.value.image
                );
        }
        else{
            console.log("on Update page!");
            this.postService.updatePost(
                this.postId,
                this.form.value.title,
                this.form.value.content,
                this.form.value.image
            );
        }
        // this.postService.addPosts(form.value.title,form.value.content);
            this.form.reset();
        }

        ngOnDestroy(){
            this.authStatusSub.unsubscribe();
        }

}