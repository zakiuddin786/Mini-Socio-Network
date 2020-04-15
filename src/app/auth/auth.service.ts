import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { EmailValidator } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn : "root"})

export class AuthService{

    private token :string;
    isAuthenticated=false;
    private tokenTimeout : any;
    private authStatusListener = new Subject<boolean>();

    constructor( private http : HttpClient, private router : Router){}

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
        this.http.post<{token:string,expiresIn:number}>("http://localhost:3000/api/user/login",authdata)
        .subscribe(response=>{
            // console.log(response);
            this.token=response.token;

            if(this.token){
                const expiresIn = response.expiresIn;

                console.log(expiresIn);

                this.setAuthTimer(expiresIn);

                this.isAuthenticated=true;
                this.authStatusListener.next(true);

                const now = new Date();
                const expirationDate= new Date(now.getTime()+expiresIn*1000);
                console.log(expirationDate);
                this.saveAuthDat(this.token,expirationDate);
                this.router.navigate(['/']);
            }
        })
    }

    logout(){
        this.token=null;
        this.isAuthenticated=false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimeout);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    autoAuthUser(){
        const authInformation=this.getAuthData();

        if(!authInformation){
            return ;
        }
        
        const now = new Date();
        const tokenValidity= authInformation.expirationDate.getTime() - now.getTime();
        
        if(tokenValidity > 0){
            this.token=authInformation.token;
            this.isAuthenticated = true; 
            this.setAuthTimer(tokenValidity/1000);
            this.authStatusListener.next(true);
        }
    }

    saveAuthDat(token:string, expires: Date){
    localStorage.setItem("token",token);
    localStorage.setItem("expiration",expires.toISOString());//converting to Iso string because it'll be easier to convert it again into data
    }

    clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    }
 
    private setAuthTimer(duration: number){
        console.log("timmer set to "+duration);
        this.tokenTimeout=setTimeout(()=>{
            this.logout();
        },duration*1000);
    }

    private getAuthData(){
        const token = localStorage.getItem("token");
        const expirationDate=localStorage.getItem("expiration");

        if(!token || !expirationDate){
            return;
        }
        return{
            token:token,
            expirationDate:new Date(expirationDate)
        }
    }
}