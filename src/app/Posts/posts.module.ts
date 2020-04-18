import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PostListComponent } from './post-list/post-list.component';
import { CreatePostComponent } from './create-posts/create-post.component';
import { AngularMaterialModule } from '../angular.material.module';

@NgModule({
    declarations:[
        PostListComponent,
        CreatePostComponent
    ],
    imports:[
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule
    ]
})

export class PostModule{

}