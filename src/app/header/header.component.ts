import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subject, Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiDataService } from '../Api-Data/api-data.service';

@Component({
    selector:"app-header",
    templateUrl:"./header.component.html",
    styleUrls:["./header.component.css"]
})
export class HeaderComponent implements OnInit,OnDestroy{
    userIsAuthenticated =false;
    private authListenerSubs : Subscription;
    SearchBarForm : FormGroup;
    constructor(private authService: AuthService, private dataService: ApiDataService){
       this.SearchBarForm = new FormGroup({
         SearchWord : new FormControl('')
       })
    }

  public descriptionSearched = new Subject<string>();


    ngOnInit() {
        this.userIsAuthenticated=this.authService.isAuth();
    this.authListenerSubs=this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated=>{
        this.userIsAuthenticated=isAuthenticated;
    });
    }

    onLogout(){
        this.authService.logout();
    }

    ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
    }

    onSubmit(){}
}
