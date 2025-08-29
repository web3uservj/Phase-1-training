import { Injectable } from '@angular/core';
import {Place} from './models/place.interface'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Book } from './models/book.interface';
import { Observable } from 'rxjs';
import { NewBook } from './models/NewBook.interface';
import {User} from './models/User.interface';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http:HttpClient) { }
  my_fav_places:Place[]=[
      {Name:'trichy',elevation:81},
      {Name:'thanjavur',elevation:88},
      {Name:'thirunelveli',elevation:47}
    ];

  private apiurl = 'http://localhost:5211/Book';
  private userapi='http://localhost:5211/User';

getbook(): Observable<Book[]> {
  this.http.get<Book[]>(`${this.apiurl}/GetAllBooks`)
    .subscribe(
      response => {
       // console.log(response); // handle the response here
      },
      error => {
        console.error(error); // handle errors here
      }
    );
    return this.http.get<Book[]>(`${this.apiurl}/GetAllBooks`);
}

deletebyId(id:number){
  return this.http.delete(`${this.apiurl}/DeleteBook/${id}`,{
     responseType: 'text'
  });


}
  getfavplaces():string{
    return "thainland"
  }

addbook(book: Book): Observable<string> {
  const token:string="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJQYXNzd29yZCI6IjU5OTQ0NzFhYmIwMTExMmFmY2MxODE1OWY2Y2M3NGI0ZjUxMWI5OTgwNmRhNTliM2NhZjVhOWMxNzNjYWNmYzUiLCJleHAiOjE3NTYzNzUzNTQsImlzcyI6Imh0dHBzOi8vd3d3LnBheW9kYS5jb20iLCJhdWQiOiJTdHVkZW50c19DU2hhcnAifQ.5qV9Le_hUvzyjvnZViMnp0tG351V2952ABlFYnu3cgs";
  const header=new HttpHeaders().set('Content-Type','application/json').append('Authorization',`Bearer ${token}`);
  return this.http.post(`${this.apiurl}/AddBook`, book, {
    headers:header,
    responseType: 'text'
  });
}

FetchAllNewBook():Observable<NewBook[]>{
  return this.http.get<NewBook[]>(`${this.apiurl}/FetchAllNewBook`)
}
admin_user:User={ username:"admin",password:"12345"};
 performLogin(){
  this.http.post(`${this.userapi}/Login`,this.admin_user,{
    responseType:"text"
  }).subscribe((val)=>{
    console.log(val);
    localStorage.setItem('token',val);
  });
 }

 UpdateBook(id:number,book: Book): Observable<any> {
  return this.http.put(`${this.apiurl}/UpdateBook/${id}`, book,{
     responseType:"text"
  });
}

}

