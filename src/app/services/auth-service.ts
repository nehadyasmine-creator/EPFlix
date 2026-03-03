import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { User } from '../models/users';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly url = 'http://localhost:8080/users';
  
  private loggedInSubject = new BehaviorSubject<boolean>(this.checkToken());
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  
  isLoggedIn$ = this.loggedInSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  private checkToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  login(email: string, password: string): Observable<User> {
    return this.httpClient.post<User>(`${this.url}/login`, { email, password }).pipe(
      tap((user: User) => {
        localStorage.setItem('authToken', 'token_' + Date.now());
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.loggedInSubject.next(true);
        this.currentUserSubject.next(user);
      })
    );
  }

  findByEmail(email: string): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.url}`).pipe(
      map(users => (users || []).filter(u => (u.email || '').toLowerCase() === (email || '').toLowerCase()))
    );
  }

  register(user: User): Observable<User> {
    return this.httpClient.post<User>(this.url, user).pipe(
      tap((newUser: User) => {
        localStorage.setItem('authToken', 'token_' + Date.now());
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.loggedInSubject.next(true);
        this.currentUserSubject.next(newUser);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.loggedInSubject.next(false);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.checkToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUser(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.url}/${id}`);
  }

  updateUser(user: User): Observable<User> {
    return this.httpClient.put<User>(`${this.url}/${user.id}`, user).pipe(
      tap((updatedUser: User) => {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<User> {
    return this.httpClient.post<User>(`${this.url}/change-password`, { 
        oldPassword, 
        newPassword 
    }).pipe(
        tap((user: User) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        })
    );
  }
  
  getAllUsers(): Observable<User[]> {
  return this.httpClient.get<User[]>(`${this.url}`);
}
}