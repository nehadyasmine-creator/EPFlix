import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(this.checkToken());
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor() {}

  private checkToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  login(email: string, password: string) {
    const token = 'fake_token_' + Date.now();
    localStorage.setItem('authToken', token);
    this.loggedInSubject.next(true);
  }

  logout() {
    localStorage.removeItem('authToken');
    this.loggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.checkToken();
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}