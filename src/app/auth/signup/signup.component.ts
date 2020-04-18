import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl:'./signup.component.html',
    styleUrls:['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{
isLoading =false;
private authStatusSub : Subscription;
constructor(public authService: AuthService){}

ngOnInit(){
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
        authStatus =>{
            this.isLoading=false;
        }
    )
}

onSignup(form :NgForm){
    if(form.invalid){
        console.log("invalid details");
        return;
    }
    this.isLoading=true;
    this.authService.createUser(form.value.email,form.value.password);
    // console.log(form.value);
}

ngOnDestroy(){
    this.authStatusSub.unsubscribe();
}
    
}