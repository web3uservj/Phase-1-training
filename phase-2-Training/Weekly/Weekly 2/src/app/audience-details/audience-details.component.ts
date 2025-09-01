import { Component, OnInit } from '@angular/core';
import { AudienceService, Audience } from '../audience.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-audience-details',
  templateUrl: './audience-details.component.html',
  styleUrls: ['./audience-details.component.css']
})
export class AudienceDetailsComponent implements OnInit {
  audience?: Audience;

 constructor(
  private audienceService: AudienceService,
  private route: ActivatedRoute,
  public router: Router  // <--- change to public
) {}


  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.audienceService.getAudience(name).subscribe({
        next: data => {
          if (data) {
            this.audience = data;
          } else {
            this.router.navigate(['/']);
          }
        },
        error: () => this.router.navigate(['/'])
      });
    } else {
      this.router.navigate(['/']);
    }
  }
}
