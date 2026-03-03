import { TitleCasePipe, CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Input } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { User } from '../models/users';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../services/toast';
import { inject } from '@angular/core';
import { Review } from '../models/reviews';
import { ReviewService } from '../services/review-service';

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
  private reviewService = inject(ReviewService);
  showProfileDropdown: boolean = false;
  dropdownTimeout: any;

  userReviews: Review[] = [];
  showReviewsTab: boolean = false;

  // search box
  searchValue: string = '';
  private router = inject(Router);

  private toastService = inject(ToastService);

  constructor(private authService: AuthService) { }

  isAdminMode: boolean=false;
  isDarkMode = signal(false);

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUser = this.authService.getCurrentUser();

    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    if (this.currentUser) {
      this.loadUserReviews();
    }

    this.updateAdminStatus();

    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      this.isDarkMode.set(true);
      this.applyDarkMode(true);
    }
  }

  toggleDarkMode() {
    const newMode = !this.isDarkMode();
    this.isDarkMode.set(newMode);
    localStorage.setItem('darkMode', String(newMode));
    this.applyDarkMode(newMode);
  }

  private applyDarkMode(enabled: boolean) {
    if (enabled) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  updateAdminStatus(){
    this.isAdminMode = sessionStorage.getItem('admin_access') === 'true';
  }

  loadUserReviews() {
    if (!this.currentUser) return;

    this.reviewService.getReviewsByUser(this.currentUser.id).subscribe({
      next: (reviews) => {
        this.userReviews = reviews;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des reviews:', err);
      }
    });
  }

  openReviewsTab() {
    this.showReviewsTab = true;
    this.loadUserReviews();
  }

  closeReviewsTab() {
    this.showReviewsTab = false;
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
      this.toastService.show('Veuillez entrer votre email.', { classname: 'bg-danger text-white' });
      return;
    }

    this.loading = true;

    this.authService.findByEmail(this.email).subscribe({
      next: (users) => {
        const user = users && users.length ? users[0] : null;
        if (!user) {
          this.loading = false;
          this.toastService.show('Aucun compte trouvé pour cet email.', { classname: 'bg-danger text-white' });
          return;
        }

        if (user.password) {
          if (!this.password) {
            this.loading = false;
            this.toastService.show('Cet utilisateur nécessite un mot de passe.', { classname: 'bg-danger text-white' });
            return;
          }

          this.authService.login(this.email, this.password).subscribe({
            next: () => {
              this.loading = false;
              this.email = '';
              this.password = '';
              this.toastService.show('Connexion réussie', { classname: 'bg-success text-white' });
            },
            error: (err) => {
              this.loading = false;
              this.toastService.show('Échec de la connexion : mot de passe incorrect.', { classname: 'bg-danger text-white' });
            }
          });
        } else {
          localStorage.setItem('authToken', 'token_' + Date.now());
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.authService['loggedInSubject'].next(true);
          this.authService['currentUserSubject'].next(user);
          this.loading = false;
          this.email = '';
          this.toastService.show('Connexion réussie', { classname: 'bg-success text-white' });
        }
      },
      error: (err) => {
        this.loading = false;
        this.toastService.show('Erreur lors de la vérification de l\'email.', { classname: 'bg-danger text-white' });
      }
    });
  }

  onSearch() {
    const term = this.searchValue.trim();
    if (term) {
      this.router.navigate(['/movies'], { queryParams: { search: term } });
    } else {
      this.router.navigate(['/movies']);
    }
  }

  isAdmin() {
    return sessionStorage.getItem('admin_access') === 'true';
  }
  adminLogOut(){
  sessionStorage.removeItem('admin_access');
    this.updateAdminStatus(); // Force la mise à jour de la variable
    this.toastService.show('Déconnecté du mode Admin', { classname: 'bg-info text-white' });

    setTimeout(() => {
    window.location.reload(); 
  }, 1700); //pour laisser le temps au message toast de s'afficher et d'etre lu
}

toggleDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  openDropdown() {
    clearTimeout(this.dropdownTimeout);
    this.showProfileDropdown = true;
  }

  closeDropdown() {
    this.dropdownTimeout = setTimeout(() => {
      this.showProfileDropdown = false;
    }, 200); // délai de 200ms avant fermeture
  }

  ngOnDestroy() {
    if (this.dropdownTimeout) {
      clearTimeout(this.dropdownTimeout);
    }
  }
}