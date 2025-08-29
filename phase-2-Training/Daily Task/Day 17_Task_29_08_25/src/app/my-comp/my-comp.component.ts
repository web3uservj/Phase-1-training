import { Component } from '@angular/core';
import {Place} from '../models/place.interface'
import { BookService } from '../book.service';
import { Book } from '../models/book.interface';
import { Title } from '@angular/platform-browser';
import { __values } from 'tslib';
import { NewBook } from '../models/NewBook.interface';

@Component({
  selector: 'app-my-comp',
  templateUrl: './my-comp.component.html',
  styleUrls: ['./my-comp.component.css']
})
export class MyCompComponent {
  constructor(private bookservice:BookService){

  }
  ooty:Place={Name:'tuty',elevation:4}
  newPlace:string=""
  newelevation:number=0
  
  title:string="";
  author:string="";
  price:number=0;
  date:Date=new Date();
  genre:string="";

updateId: number=0;
updateTitle: string = '';
updateAuthor: string = '';
updateGenre: string = '';
updatePrice!: number;
updateDate: Date = new Date();
updateMessage: string = '';

  
  addmore(){
    console.log("button clicked");
    //this.my_fav_places.push({Name:'kanyakumari',elevation:0});
     this.my_fav_places=[...this.my_fav_places,{Name:this.newPlace,elevation:this.newelevation

     }];

  this.bookservice.addbook({
  title:this.title,
  author: this.author,
  price: this.price,
  publishedDate:this.date,
  genre: this.genre
}).subscribe(
  value => {
    console.log(`added: ${value}`);
  },
  error => {
    console.error('Error adding book:', error);
  }
);
this.getbook();

  }
  
  my_fav_places:Place[]=this.bookservice.my_fav_places;
  books: Book[] = [
  // {
  //   title: "",
  //   author: "",
  //   price: 0,
  //   id: 0,
  //   publishedDate: new Date("2025-08-28T06:57:46.291Z"),
  //   genre: ""
  // }
];

place_from_service: string = "";

  ngOnInit(){
  //   this.place_from_service=this.bookservice.getfavplaces();
  // console.log(`from servive ${this.place_from_service}`);
  console.log("before calling service");
  this.getbook();
  this.FetchAllNewBook();

  this.bookservice.performLogin();
}
ngAfterContentInit(){
  console.log("after content initialized")
}

deleteMessage: string = '';

deletebyId(id:number){
  this.bookservice.deletebyId(id).subscribe(
    value=>{
      this.deleteMessage=value;
      console.log(value);
    },
     (error) => {
      this.deleteMessage = `❌ Failed to delete book: ${error.message || 'Unknown error'}`;
      console.error(error);
    }
  )
}
getbook(){
  this.bookservice.getbook().subscribe(
    value=>{
      this.books=value;
      console.log(this.books[0].author);
    }
  );
}

newBooks:NewBook[]=[];

FetchAllNewBook(){
  this.bookservice.FetchAllNewBook().subscribe(
    response=>{
      this.newBooks=response;
      console.log(response);
    }
  );
}

updateBook() {
  const updatedBook = {
    title: this.updateTitle,
    author: this.updateAuthor,
    genre: this.updateGenre,
    price: this.updatePrice,
    publishedDate: this.updateDate
  };

  this.bookservice.UpdateBook(this.updateId,updatedBook).subscribe({
    next: (res) => {
      this.updateMessage = 'Book updated successfully!';
      this.getbook(); // Refresh book list if needed
    },
    error: (err) => {
      this.updateMessage = 'Failed to update book.';
      console.error(err);
    }
  });
}

}

