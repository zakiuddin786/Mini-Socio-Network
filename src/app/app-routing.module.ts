import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './Posts/post-list/post-list.component';
import { CreatePostComponent } from './Posts/create-posts/create-post.component';


const routes: Routes = [
  { path:'',component:PostListComponent},
  { path:'create', component:CreatePostComponent},
  { path:'edit/:postId', component:CreatePostComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
