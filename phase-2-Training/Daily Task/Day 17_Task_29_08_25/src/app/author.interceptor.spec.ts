import { TestBed } from '@angular/core/testing';

import { AuthorInterceptor } from './author.interceptor';

describe('AuthorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthorInterceptor = TestBed.inject(AuthorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
