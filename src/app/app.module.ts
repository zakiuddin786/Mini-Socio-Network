import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatInputModule, 
         MatButtonModule,
         MatCardModule,
         MatToolbarModule,
         MatExpansionModule, 
         MatProgressSpinnerModule,
         MatPaginatorModule} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreatePostComponent } from './Posts/create-posts/create-post.component';
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './Posts/post-list/post-list.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    CreatePostComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    HttpClientModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
