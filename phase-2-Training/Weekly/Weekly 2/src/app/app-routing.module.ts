import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AudienceListComponent } from './audience-list/audience-list.component';
import { BookTicketComponent } from './book-ticket/book-ticket.component';
import { AudienceDetailsComponent } from './audience-details/audience-details.component';

const routes: Routes = [
  { path: '', component: AudienceListComponent },
  { path: 'book-ticket', component: BookTicketComponent },
  { path: 'details/:name', component: AudienceDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
