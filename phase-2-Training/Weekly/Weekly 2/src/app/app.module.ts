import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';           // for ngModel
import { HttpClientModule } from '@angular/common/http'; // for HttpClient

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AudienceListComponent } from './audience-list/audience-list.component';
import { BookTicketComponent } from './book-ticket/book-ticket.component';
import { AudienceDetailsComponent } from './audience-details/audience-details.component';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    AudienceListComponent,
    BookTicketComponent,
    AudienceDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    AppRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
