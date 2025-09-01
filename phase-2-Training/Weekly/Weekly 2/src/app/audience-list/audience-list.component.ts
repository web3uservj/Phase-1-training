import { Component, OnInit } from '@angular/core';

export interface Audience {
  name: string;
  age: number;
  gender: string;
}

@Component({
  selector: 'app-audience-list',
  templateUrl: './audience-list.component.html',
  styleUrls: ['./audience-list.component.css']
})
export class AudienceListComponent implements OnInit {
  audiences: Audience[] = [];
  selectedGender: string = '';
  totalAudience: number = 0;
  averageAge: number = 0;

  allAudiences: Audience[] = [
    { name: 'Alice', age: 25, gender: 'Female' },
    { name: 'Bob', age: 30, gender: 'Male' },
    { name: 'Charlie', age: 22, gender: 'Male' },
    { name: 'Diana', age: 28, gender: 'Female' },
    { name: 'Ethan', age: 35, gender: 'Male' }
  ];

  constructor() {}

  ngOnInit(): void {
    this.loadAudiences();
  }

  loadAudiences() {
    if (this.selectedGender) {
      this.audiences = this.allAudiences.filter(a => a.gender === this.selectedGender);
    } else {
      this.audiences = [...this.allAudiences];
    }
    this.totalAudience = this.audiences.length;
    this.averageAge = this.audiences.length
      ? +(this.audiences.reduce((sum, a) => sum + a.age, 0) / this.audiences.length).toFixed(2)
      : 0;
  }

  filterByGender() {
    this.loadAudiences();
  }

  deleteAudience(name: string) {
    if (confirm(`Are you sure you want to delete audience: ${name}?`)) {
      this.allAudiences = this.allAudiences.filter(a => a.name !== name);
      this.loadAudiences();
    }
  }

  viewDetails(name: string) {
    alert(`Viewing details for ${name}`);
  }
}
