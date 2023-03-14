import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';
import { Page } from '../interface/page';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly serverUrl: string =  'http://localhost:8080';

  constructor(private http: HttpClient) { }

  //make call to the back end API to retrieve page of users

  users$ = (name: string = '',page: number = 0,size: number = 10): Observable<Page> =>
     this.http.get<Page>(`${this.serverUrl}/users?name=${name}&page=${page}&size=${size}`)

  


  // getUsers(name: string = '',page: number = 0,size: number = 10): Observable<Page>{
  //   return this.http.get<Page>(`${this.serverUrl}/users?name=${name}&page=${page}&size=${size}`)

  // }
}
