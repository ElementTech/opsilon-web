import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
    //   private token: any = "";
    //   private getToken(): string {
    //     if (!this.token) {
    //       this.token = localStorage.getItem('mean-token');
    //     }
    //     return this.token;
    //   }

  //baseUri:string = 'http://'+environment.api+':8080/api/v1';
  baseURL:string = window.location.protocol + '//' + window.location.host + '/api/v1'
  //webUri:string = 'http://localhost:8080/api/v1';
  // headers = new HttpHeaders().set('Content-Type', 'application/json')//.set("Authorization", `Bearer ${this.getToken()}`);

  constructor(private http: HttpClient) { }
  getVersion(): Observable<any> {
    return this.http.get(`${this.baseURL}/version`,{responseType:'text'})
  }
  getWorkflowID(w:any,r:any): Observable<any> {
    return this.http.get(`${this.baseURL}/run/id?workflow=${w}&repo=${r}`,{responseType:'text'})
  }
  getWorkflowHistory(w:any,r:any): Observable<any> {
    return this.http.get(`${this.baseURL}/run/history?workflow=${w}&repo=${r}`,{responseType:'json'})
  }
  // here is a simple ndjson parser implementation I found:
  parse(data: string): any[] {
    if (typeof data !== 'string')
      throw new Error(`Unexpected type ${typeof data}`);
    const rows = data.split(/\n|\n\r/).filter(Boolean);
    return rows.map((row) => JSON.parse(row));
  }
  runWorkflow(data:any): Observable<any> {
    return this.http.post(`${this.baseURL}/run`,data,{responseType:"text"}).pipe(map(this.parse));
  }

  get(route: string): Observable<any> {
    return this.http.get(`${this.baseURL}/${route}`)
  }

  post(route: string, data: any): Observable<any> {
    return this.http.post(`${this.baseURL}/${route}`,data,{responseType:"json"})
  }

  deleteJson(route: string, item: string): Observable<any> {
    return this.http.delete(`${this.baseURL}/${route}/${item}`)
  }
  deleteText(route: string, item: string): Observable<any> {
    return this.http.delete(`${this.baseURL}/${route}/${item}`,{responseType:'text'})
  }



  // postData(data: any): Observable<any> {
  //   return this.http.post(`${this.baseURL}/post`, data)
  // }

  // updateData(data: any, id: string): Observable<any> {
  //   return this.http.patch(`${this.baseURL}/update/${id}`, data)
  // }

  // deleteData(id: string): Observable<any> {
  //   return this.http.delete(`${this.baseURL}/delete/${id}`)
  // }

}
