import { Component, inject } from '@angular/core';
import { NgFor,NgClass } from '@angular/common';
import { ToastService } from '../services/toast';
@Component({
  selector: 'app-toasts-container',
  standalone:true,
  imports: [NgFor,NgClass],
  templateUrl: './toasts-container.html',
  styleUrl: './toasts-container.scss',
})
export class ToastsContainer {
  public toastService = inject(ToastService);

}
