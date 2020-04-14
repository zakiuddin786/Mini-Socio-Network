import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { EmailValidator } from '@angular/forms';
import { Subject } from 'rxjs';

@Injectable({ providedIn : "root"})

export class AuthService{

    private token :string;
    isAuthenticated=false;
    private authStatusListener = new Subject<boolean>();

    constructor( private http : HttpClient){}

    createUser(email:string,password:string){

        const authData:AuthData = {email:email, password :password};

        this.http.post("http://localhost:3000/api/user/signup", authData)
        .subscribe(response =>{
            console.log(response);
        });
    }

    getToken(){
        return this.token;
    }
    isAuth(){
        return this.isAuthenticated;
    }

    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }

    login(email:string,password:string){
        const authdata:AuthData={email:email,password:password};
        this.http.post<{token:string}>("http://localhost:3000/api/user/login",authdata)
        .subscribe(response=>{
            // console.log(response);
            this.token=response.token;
            if(this.token){
                this.isAuthenticated=true;
                this.authStatusListener.next(true);
            }
        })
    }

    logout(){
        this.token=null;
        this.isAuthenticated=false;
        this.authStatusListener.next(false);
    }
}