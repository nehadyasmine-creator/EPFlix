import { TitleCasePipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';   
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { User } from '../models/users';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../services/toast';
import { inject } from '@angular/core';


@Component({
  selector: 'app-navbar',
  imports: [TitleCasePipe, RouterLink, JsonPipe, CommonModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})

export class Navbar implements OnInit {
  isLoggedIn: boolean = false;
  currentUser: User | null = null;
  email: string = '';
  password: string = '';
  loading: boolean = false;
  loginError: string | null = null;

  private toastService = inject(ToastService);

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUser = this.authService.getCurrentUser();
    
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
    this.email = '';
    this.password = '';
    this.loginError = null;
    this.toastService.show('Déconnecté !', { classname: 'bg-success text-white' });
  }

  onLogin() {
    this.loginError = null;
    if (!this.email) {
      this.toastService.show('Veuillez entrer votre email.', {classname: 'bg-danger text-white'});
      return;
    }

    this.loading = true;

    this.authService.findByEmail(this.email).subscribe({
      next: (users) => {
        const user = users && users.length ? users[0] : null;
        if (!user) {
          this.loading = false;
          this.toastService.show('Aucun compte trouvé pour cet email.', {classname: 'bg-danger text-white'});
          return;
        }

        if (user.password) {
          if (!this.password) {
            this.loading = false;
            this.toastService.show('Cet utilisateur nécessite un mot de passe.', {classname: 'bg-danger text-white'});
            return;
          }

          this.authService.login(this.email, this.password).subscribe({
            next: () => {
              this.loading = false;
              this.email = '';
              this.password = '';
              this.toastService.show('Connexion réussie', {classname: 'bg-success text-white'});
            },
            error: (err) => {
              this.loading = false;
              this.toastService.show('Échec de la connexion : mot de passe incorrect.', {classname: 'bg-danger text-white'});
            }
          });
        } else {
          localStorage.setItem('authToken', 'token_' + Date.now());
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.authService['loggedInSubject'].next(true);
          this.authService['currentUserSubject'].next(user);
          this.loading = false;
          this.email = '';
          this.toastService.show('Connexion réussie', {classname: 'bg-success text-white'});
        }
      },
      error: (err) => {
        this.loading = false;
        this.toastService.show('Erreur lors de la vérification de l\'email.', {classname: 'bg-danger text-white'});
      }
    });
  }
}