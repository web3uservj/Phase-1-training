import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MyCompComponent } from './my-comp/my-comp.component';
import { FormsModule } from '@angular/forms';
import { BookService } from './book.service'; 
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';  
import { AuthorInterceptor } from './author.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    MyCompComponent
  ],
  imports: [
    BrowserModule,FormsModule,HttpClientModule
  ],
  providers: [BookService,{
    provide:HTTP_INTERCEPTORS,useClass:AuthorInterceptor,multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
