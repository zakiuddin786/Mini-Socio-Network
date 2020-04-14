import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
    templateUrl:'./signup.component.html',
    styleUrls:['./signup.component.css']
})
export class SignupComponent{
isLoading =false;

constructor(public authService: AuthService){}

onSignup(form :NgForm){
    if(form.invalid){
        console.log("invalid details");
        return;
    }
    this.authService.createUser(form.value.email,form.value.password);
    // console.log(form.value);
}
    
}