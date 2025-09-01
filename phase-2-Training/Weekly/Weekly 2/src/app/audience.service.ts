import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Audience {
  name: string;
  age: number;
  gender: string;
}

@Injectable({
  providedIn: 'root'
})
export class AudienceService {
  private audiences: Audience[] = [
    { name: 'Alice', age: 25, gender: 'Female' },
    { name: 'Bob', age: 30, gender: 'Male' },
    { name: 'Charlie', age: 22, gender: 'Male' },
    { name: 'Diana', age: 28, gender: 'Female' },
    { name: 'Ethan', age: 35, gender: 'Male' }
  ];

  getAudiences(): Observable<Audience[]> {
    return of(this.audiences);
  }

  getAudience(name: string): Observable<Audience | undefined> {
    const audience = this.audiences.find(a => a.name.toLowerCase() === name.toLowerCase());
    return of(audience);
  }

  addAudience(audience: Audience): Observable<Audience> {
    this.audiences.push(audience);
    return of(audience);
  }
}
