import { Component , OnInit, OnDestroy} from '@angular/core';

import { Post } from '../post-model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { ApiDataService } from 'src/app/Api-Data/api-data.service';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
@Component({
    selector:"app-post-list",
    templateUrl:"./post-list.component.html",
    styleUrls:["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy{

    posts:any;
    private postSub:Subscription;
    isLoading=false;
    totalPosts=0;
    postsPerPage=10;
    currentPage=1;
    userId:string;
    SearchBarForm : FormGroup;
    errorMessage:any;

    pageSizeOptions=[1,2,5,10,15,20];
    private authStatusSubs : Subscription;
    userIsAuthenticated=false;

    constructor(public postService: PostsService ,private authService:AuthService,
      private dataService:ApiDataService){
        this.SearchBarForm = new FormGroup({
          searchPost: new FormControl(""),
        })
      }



  public descriptionSearched = new Subject<string>();

  public searchByPostDescription(){
    console.log("search");
    this.descriptionSearched.pipe(
      map((e:any)=>{
        console.log(e.target.value);
        return e.target.value
      }),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(word=>{
        this.isLoading= true;
        return this.searchPosts(word);
      }),
      catchError((err)=>{
        console.log(err);
        this.isLoading=false;
        this.errorMessage=err.message;
        return throwError(err);
      })
    ).subscribe(val=>{
      this.isLoading=false;
      console.log(this.isLoading);

      // console.log("Posts Fetched Based On Description")
    })
  }

  public searchPosts(word):Observable<any>{
    word=word.trim();
    if(word===""){
      console.log("no word entered");
      // return empty()
      return of(null);
    }
    else{
      return this.dataService.getData("/posts/getPosts/"+word).pipe(
        map(response =>{
          let postsFetched = response['posts'];
          // console.log("posts are",postsFetched);
            // postsFetched=response;
            this.posts=postsFetched;

            console.log("posts fetched based on post Description");
            // console.log(this.posts);
        })
      )
    }
  }

  likeCheck(arr,id){
      let check=false;
      if(arr){
        arr.some(function(el){
          if(el.user==id)
          check=true;
          return el.user==id
        })
      }
      return check;
  }

    ngOnInit()
    {
       this.isLoading=true;
      this.searchByPostDescription();


       this.userIsAuthenticated=this.authService.isAuth();
       this.userId=this.authService.getUserId();
       console.log(this.userId," Checking ")

       this.authStatusSubs=this.authService
       .getAuthStatusListener()
       .subscribe(isAuthenticated=>{
           this.userIsAuthenticated=isAuthenticated;
           this.userId=this.authService.getUserId();

       });

       this.dataService.getData("/posts/getAllPosts").subscribe(data=>{
         this.posts=data['posts'];
         this.isLoading=false;
         console.log("from inti",data);
       })

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
        // return this.http.delete(BACKEND_URL+"deletePost/"+id)
        this.dataService.deleteData(`/posts/deletePost/${postId}`).subscribe(data=>{
          console.log(data);
          this.dataService.getData("/posts/getAllPosts").subscribe(data=>{
            this.posts=data['posts'];
            this.isLoading=false;
            // console.log("from inti",data);
          })

        },err=>{
          console.log(err);
          this.isLoading=false;
        })
        // this.postService.deletePost(postId).subscribe(()=>{
        // this.postService.getPosts(this.postsPerPage,this.currentPage);
        // }, ()=>{
        //     this.isLoading=false;
        // });
    }

    onLike(postId:string,index:any)
    {
        this.isLoading=true;
        if(this.likeCheck(this.posts[index].likes,this.userId)){
            this.isLoading=false;
            alert("already Liked the post");
            return;
        }
        this.dataService.postData(`/posts/like/${postId}`,postId).subscribe(data=>{
          console.log(data);
          this.dataService.getData("/posts/getAllPosts").subscribe(data=>{
            this.posts=data['posts'];
            this.isLoading=false;
            // console.log("from inti",data);
          })
        },err=>{
          console.log(err);
          this.isLoading=false;
        })
    }

    onunlike(postId:string)
    {
        this.isLoading=true;
        this.dataService.postData(`/posts/unlike/${postId}`,postId).subscribe(data=>{
          console.log(data);
          this.dataService.getData("/posts/getAllPosts").subscribe(data=>{
            this.posts=data['posts'];
            this.isLoading=false;
            console.log("from inti",data);
          })
        })
    }

    onComment(postId:string,text:string)
    {
        this.isLoading=true;
        this.postService.comment(postId,text).subscribe(()=>{
        this.postService.getPosts(this.postsPerPage,this.currentPage);
        }, ()=>{
            this.isLoading=false;
        });
    }

    ngOnDestroy(){
        // this.postSub.unsubscribe();
        // this.authStatusSubs.unsubscribe();
    }

    onSubmit(){
      console.log("submitting")
    }
}
