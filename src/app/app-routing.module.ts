import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './Posts/post-list/post-list.component';
import { CreatePostComponent } from './Posts/create-posts/create-post.component';
import{ LoginComponent } from './auth/login/login.component'
import { SignupComponent } from './auth/signup/signup.component';

const routes: Routes = [
  { path:'',component:PostListComponent},
  { path:'create', component:CreatePostComponent},
  { path:'edit/:postId', component:CreatePostComponent},
  { path: 'login',component:LoginComponent},
  { path: 'signup',component:SignupComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
