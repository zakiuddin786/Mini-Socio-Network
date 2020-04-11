import {Component, EventEmitter, Output} from '@angular/core';

import { Post } from '../post-model';

@Component({
    selector:'app-create-post',
    templateUrl:"./create-post.component.html",
    styleUrls:["./create-post.component.css"]
})
export class CreatePostComponent{
    enteredTitle="";
    enteredContent="";
    @Output() postCreated=new EventEmitter<Post>();
    onAddPost(){
        const post :Post={
                title:this.enteredTitle,
                content:this.enteredContent
            };
            this.postCreated.emit(post);
        }
}