import { Component } from '@angular/core';
import { AudienceService, Audience } from '../audience.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-ticket',
  templateUrl: './book-ticket.component.html',
  styleUrls: ['./book-ticket.component.css']
})
export class BookTicketComponent {
  audience: Audience = { name: '', age: 0, gender: '' };
  errorMessage: string = '';

  constructor(private audienceService: AudienceService, private router: Router) {}

  bookTicket() {
    if (!this.audience.name || !this.audience.age || !this.audience.gender) {
      this.errorMessage = 'Please fill all fields correctly.';
      return;
    }

    this.audienceService.addAudience(this.audience).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => this.errorMessage = 'Failed to book ticket.'
    });
  }
}
