import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { User } from '../models/users';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastService } from '../services/toast';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly authService = inject(AuthService)

  private readonly router = inject(Router)
  private toastService = inject(ToastService);

  user: User = {
    firstName: '',
    lastName: '',
    age: null as any,
    email: '',
    password: '',
    points: 0,
    id: 0
  }
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirm: boolean = false;
  loading: boolean = false;

  register(): void {
    if (!this.user.firstName || !this.user.lastName || !this.user.email || !this.user.password || !this.confirmPassword) {
      this.toastService.show('Veuillez remplir tous les champs.', { classname: 'bg-danger text-white' });
      return;
    }
    if (this.user.password !== this.confirmPassword) {
      this.toastService.show('Les mots de passe ne correspondent pas.', { classname: 'bg-danger text-white' });
      return;
    }
    this.loading = true;
    console.log('register payload', this.user);
    this.authService.register(this.user).subscribe({
      next: (user) => {
        this.loading = false;
        this.toastService.show('Inscription réussie !', { classname: 'bg-success text-white' });
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Registration error', error);
        const msg = error?.error?.message || 'Erreur lors de l\'inscription.';
        this.toastService.show(msg, { classname: 'bg-danger text-white' });
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirm() {
    this.showConfirm = !this.showConfirm;
  }
}