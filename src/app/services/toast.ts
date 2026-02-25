import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  show(text: string, options: any = {}) {
  const toast = { text, isClosing: false, ...options };
  this.toasts.push(toast);


  setTimeout(() => {
    toast.isClosing = true;
  }, 2800);

  // 2. On supprime réellement après 3s
  setTimeout(() => {
    this.remove(toast);
  }, 3000);
}

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}