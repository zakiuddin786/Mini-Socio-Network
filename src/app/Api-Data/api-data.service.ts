import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class ApiDataService {
  url = '';

  constructor(private http: HttpClient) {
    if (isDevMode()) {
      this.url = "http://localhost:3000";
    }
    else
    this.url = "https://miniprojectbackend.azurewebsites.net"
  }


  getData(route) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
        token
    });
    console.log(headers);
    return this.http.get(this.url + '/api' + route, { headers });
    // return this.http.get(this.url + '/api' + route);
  }

  getDataWithParam(route,param){
    return this.http.get(this.url)
  }

  getD(route) {
    return this.http.get(this.url +'/api'+ route);
  }

  postD(route,body) {
    return this.http.post(this.url +'/api'+ route,body);
  }


  postData(route, body) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      token
    });
    console.log(route);
    return this.http.post(this.url + '/api' + route, body, { headers });
    // return this.http.post(this.url + '/api' + route, body);

  }

  putData(route, body) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      token
    });
    return this.http.put(this.url + '/api' + route, body, { headers });
    // return this.http.put(this.url + '/api' + route, body);
  }

  deleteData(route) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      token
    });
    return this.http.delete(this.url + '/api' + route, { headers });
    // return this.http.delete(this.url + '/api' + route);

  }



}
