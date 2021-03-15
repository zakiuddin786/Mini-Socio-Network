import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
    templateUrl:'./login.component.html',
    styleUrls:['./login.component.css']
})

export class LoginComponent{
    isLoading=false;
    private authStatusSub : Subscription;

    ngOnInit(){
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
            authStatus =>{
                this.isLoading=false;
            }
        );
    }
    constructor(public authService:AuthService, private toster: ToastrService){}

    onLogin(form: NgForm){
        if(form.invalid){
            console.log("invalid form!");
            return;
        }
        this.isLoading=true;

        this.authService.login(form.value.email,form.value.password);
        // console.log(form.value);
    }

    ngOnDestroy(){
        this.authStatusSub.unsubscribe();
    }
}
