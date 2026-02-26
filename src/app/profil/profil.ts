import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth-service';
import { User } from '../models/users';
import { ToastService } from '../services/toast';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profil',
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.html',
  styleUrl: './profil.scss',
})

export class Profil implements OnInit {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  currentUser: User | null = null;
  editingField: string | null = null;
  tempValue: string = '';
  loading: boolean = false;

  showPasswordForm: boolean = false;
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  passwordLoading: boolean = false;

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    if (!this.currentUser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    }
  }

  startEdit(field: string, currentValue: any) {
    this.editingField = field;
    this.tempValue = currentValue;
  }

  cancelEdit() {
    this.editingField = null;
    this.tempValue = '';
  }

  saveField(field: string) {
    if (!this.currentUser) return;

    if (!this.tempValue || this.tempValue.trim() === '') {
      this.toastService.show('Le champ ne peut pas être vide.', { classname: 'bg-danger text-white' });
      return;
    }

    if (field === 'email' && !this.isValidEmail(this.tempValue)) {
      this.toastService.show('Email invalide.', { classname: 'bg-danger text-white' });
      return;
    }

    if (field === 'age' && (isNaN(Number(this.tempValue)) || Number(this.tempValue) < 0)) {
      this.toastService.show('L\'âge doit être un nombre positif.', { classname: 'bg-danger text-white' });
      return;
    }

    this.loading = true;

    const updatedUser = { ...this.currentUser, [field]: this.tempValue };
    
    this.authService.updateUser(updatedUser).subscribe({
      next: (user) => {
        this.loading = false;
        this.currentUser = user;
        this.editingField = null;
        this.tempValue = '';
        this.toastService.show(`${field} mis à jour !`, { classname: 'bg-success text-white' });
      },
      error: (err) => {
        this.loading = false;
        this.toastService.show('Erreur lors de la mise à jour.', { classname: 'bg-danger text-white' });
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  openPasswordForm() {
    this.showPasswordForm = true;
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  closePasswordForm() {
    this.showPasswordForm = false;
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  changePassword() {
    if (!this.oldPassword) {
      this.toastService.show('Veuillez entrer votre ancien mot de passe.', { classname: 'bg-danger text-white' });
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.toastService.show('Les mots de passe ne correspondent pas.', { classname: 'bg-danger text-white' });
      return;
    }

    if (this.oldPassword === this.newPassword) {
      this.toastService.show('Le nouveau mot de passe doit être différent de l\'ancien.', { classname: 'bg-danger text-white' });
      return;
    }

    this.passwordLoading = true;
    this.toastService.show('⏳ Mise à jour du mot de passe...', { classname: 'bg-info text-white' });

    if (this.currentUser) {
      const updatedUser = { ...this.currentUser, password: this.newPassword };
      
      this.authService.updateUser(updatedUser).subscribe({
        next: (updatedUserResponse) => {
          this.passwordLoading = false;
          this.currentUser = updatedUserResponse;
          this.closePasswordForm();
          this.toastService.show('✓ Mot de passe modifié avec succès !', { classname: 'bg-success text-white' });
        },
        error: (err) => {
          this.passwordLoading = false;
          console.error('Erreur update:', err);
          this.toastService.show('❌ Erreur lors de la mise à jour du mot de passe.', { classname: 'bg-danger text-white' });
        }
      });
    }
  }
}