import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../services/toast';
import { ContactService } from '../services/contact-service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss', 
})
export class Contact {
  private toastService = inject(ToastService);
  private contactService = inject(ContactService);

  form = { name: '', email: '', subject: '', message: '' };
  submitting = false;
  submitted = false;

  submitContact() {
    if (!this.form.name?.trim()) {
      this.toastService.show('Veuillez entrer votre nom.', { classname: 'bg-danger text-white' });
      return;
    }
    if (!this.form.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
      this.toastService.show('Email invalide.', { classname: 'bg-danger text-white' });
      return;
    }
    if (!this.form.subject?.trim()) {
      this.toastService.show('Veuillez entrer un sujet.', { classname: 'bg-danger text-white' });
      return;
    }
    if (!this.form.message?.trim() || this.form.message.length < 10) {
      this.toastService.show('Message trop court (min 10 caractères).', { classname: 'bg-danger text-white' });
      return;
    }

    this.submitting = true;
    this.contactService.createContact({
      name: this.form.name.trim(),
      email: this.form.email.trim(),
      subject: this.form.subject.trim(),
      message: this.form.message.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.submitted = true;
        this.toastService.show('Message envoyé !', { classname: 'bg-success text-white' });
        setTimeout(() => {
          this.form = { name: '', email: '', subject: '', message: '' };
          this.submitted = false;
        }, 3000);
      },
      error: () => {
        this.submitting = false;
        this.toastService.show("Erreur lors de l'envoi du message.", { classname: 'bg-danger text-white' });
      }
    });
  }

  resetForm() {
    this.form = { name: '', email: '', subject: '', message: '' };
    this.submitted = false;
  }
}