import { HttpInterceptor,
         HttpRequest, 
         HttpHandler, 
         HttpErrorResponse} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material';
import { Injectable } from '@angular/core';

import { ErrorComponent } from './error/error.component';


@Injectable()

export class ErrorInterceptor implements HttpInterceptor{

    constructor(private dialog: MatDialog){}

    intercept(req:HttpRequest<any>,next:HttpHandler){
    //    console.log("im in error interceptor");
        return next.handle(req).pipe(
            catchError((error :HttpErrorResponse)=>{
                
                let errorMessage = "An Unknown Error Occurred!!";

                if(error.error.message){
                    errorMessage=error.error.message;
                }

                this.dialog.open(ErrorComponent, {data : {message : errorMessage}});
                return throwError(error);
            })
        );
    }
}