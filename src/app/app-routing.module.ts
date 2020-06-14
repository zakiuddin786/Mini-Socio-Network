import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './Posts/post-list/post-list.component';
import { CreatePostComponent } from './Posts/create-posts/create-post.component';
import{ LoginComponent } from './auth/login/login.component'
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth-guard'

const routes: Routes = [
  { path:'',component:PostListComponent},
  { path:'create', component:CreatePostComponent, canActivate:[AuthGuard]},
  { path:'edit/:postId', component:CreatePostComponent,  canActivate:[AuthGuard]},
  { path:'like/:postId', component:CreatePostComponent,  canActivate:[AuthGuard]},
  { path:'unlike/:postId', component:CreatePostComponent,  canActivate:[AuthGuard]},
  { path: 'login',component:LoginComponent},
  { path: 'signup',component:SignupComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[ AuthGuard ]
})
export class AppRoutingModule { }
