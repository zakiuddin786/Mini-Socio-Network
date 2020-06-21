import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';


import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl+"/user/";
@Injectable({ providedIn : "root"}) // postioning this is important it should be included after all the other imports are done

export class AuthService{

    private token :string;
    isAuthenticated=false;
    private tokenTimeout : any;
    private userId:string;
    private authStatusListener = new Subject<boolean>();

    constructor( private http : HttpClient, private router : Router){}

    createUser(email:string,password:string,name:string){

        const authData:AuthData = {email:email, password :password, name:name};

        this.http.post(BACKEND_URL+"signup", authData)
        .subscribe(response =>{
            console.log(response);
            this.login(email,password);
            this.router.navigate(['/']);
            console.log("i'm stuck here");
        },error =>{
            this.authStatusListener.next(false);
        });
    }


    getToken(){
        return this.token;
    }

    isAuth(){
        return this.isAuthenticated;
    }

    getUserId(){
        return this.userId;
    }

    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }

    login(email:string,password:string){
        const authdata:AuthData={email:email,password:password,name:""};
        this.http.post<{token:string}>(BACKEND_URL+"/login",authdata)
        .subscribe(response=>{
            // console.log(response);
            this.token=response.token;

            if(this.token){
               // const expiresIn = response.expiresIn;
              //  this.setAuthTimer(expiresIn);

                this.isAuthenticated=true;
                this.authStatusListener.next(true);
               // this.userId=response.userId;

                const now = new Date();
                const expirationDate= new Date(now.getTime()+4*60*60*1000);
                // console.log(expirationDate);
                this.saveAuthDat(this.token, expirationDate);
                this.router.navigate(['/']);
            }
        }, error =>{
            this.authStatusListener.next(false);
        })
    }

    logout(){
        this.token=null;
        this.isAuthenticated=false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimeout);
        this.clearAuthData();
        this.userId=null;
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
          //  this.userId=authInformation.userId; 
            this.setAuthTimer(tokenValidity/1000);
            this.authStatusListener.next(true);
        }
    }

    saveAuthDat(token:string, expires: Date){
    localStorage.setItem("token",token);
    localStorage.setItem("expiration",expires.toISOString());//converting to Iso string because it'll be easier to convert it again into data
   // localStorage.setItem("userId",userId);
}

    clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    //localStorage.removeItem("userId");
    }
 
    private setAuthTimer(duration: number){
        // console.log("timmer set to "+duration);
        this.tokenTimeout=setTimeout(()=>{
            this.logout();
        },duration*1000);
    }

    private getAuthData(){
        const token = localStorage.getItem("token");
        const expirationDate=localStorage.getItem("expiration");
       // const userId=localStorage.getItem("userId");

        if(!token || !expirationDate){
            return;
        }
        return{
            token:token,
            expirationDate:new Date(expirationDate),
         //   userId:userId
        }
    }
}