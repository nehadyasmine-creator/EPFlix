import { TitleCasePipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';   
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { User } from '../models/users';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';


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
  }

  onLogin() {
    this.loginError = null;
    if (!this.email) {
      this.loginError = 'Veuillez entrer votre email.';
      return;
    }

    this.loading = true;
    // On cherche l'utilisateur par email
    this.authService.findByEmail(this.email).subscribe({
      next: (users) => {
        const user = users && users.length ? users[0] : null;
        if (!user) {
          this.loading = false;
          this.loginError = 'Aucun compte trouvé pour cet email.';
          return;
        }

        // Si l'utilisateur a un mot de passe défini, exiger le mot de passe
        if (user.password) {
          if (!this.password) {
            this.loading = false;
            this.loginError = 'Cet utilisateur nécessite un mot de passe.';
            return;
          }
          // Appel normal login (backend valide le mot de passe)
          this.authService.login(this.email, this.password).subscribe({
            next: () => {
              this.loading = false;
              this.email = '';
              this.password = '';
            },
            error: (err) => {
              this.loading = false;
              this.loginError = err?.error?.message || 'Échec de la connexion';
            }
          });
        } else {
          // Fallback dev : permettre login par email seulement
          localStorage.setItem('authToken', 'token_' + Date.now());
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.authService['loggedInSubject'].next(true);
          this.authService['currentUserSubject'].next(user);
          this.loading = false;
          this.email = '';
        }
      },
      error: (err) => {
        this.loading = false;
        this.loginError = 'Erreur lors de la vérification de l\'email.';
      }
    });
  }
}