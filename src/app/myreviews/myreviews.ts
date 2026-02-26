import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth-service';
import { ReviewService } from '../services/review-service';
import { Review } from '../models/reviews';
import { ToastService } from '../services/toast';
import { User } from '../models/users';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-myreviews',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './myreviews.html',
  styleUrl: './myreviews.scss',
})
export class MyReviews implements OnInit {
  private authService = inject(AuthService);
  private reviewService = inject(ReviewService);
  private toastService = inject(ToastService);

  currentUser: User | null = null;
  userReviews: Review[] = [];
  loading: boolean = true;
  filteredReviews: Review[] = [];
  searchTerm: string = '';
  sortBy: string = 'recent'; // 'recent' ou 'rating'

  editingReviewId: number | null = null;
  editText: string = '';
  editRate: number = 0;
  updateLoading: boolean = false;

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Si pas d'utilisateur en mémoire, charger depuis localStorage
    if (!this.currentUser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    }

    this.loadReviews();
  }

  loadReviews() {
    this.loading = true;
    if (!this.currentUser) {
      this.toastService.show('Veuillez vous connecter.', { classname: 'bg-danger text-white' });
      this.loading = false;
      return;
    }

    console.log('Utilisateur connecté:', this.currentUser);
    console.log('Email utilisateur:', this.currentUser.email);

    // Récupérer TOUS les commentaires
    this.reviewService.getReviews().subscribe({
      next: (allReviews: Review[]) => {
        console.log('Tous les commentaires:', allReviews);
        
        // Filtrer par email au lieu de userId
        this.userReviews = allReviews.filter(review => {
          console.log(`Comparaison email: ${review.user.email} === ${this.currentUser!.email}`);
          return review.user.email === this.currentUser!.email;
        });
        
        console.log('Commentaires filtrés:', this.userReviews);
        this.toastService.show(`${this.userReviews.length} commentaires trouvés`, { classname: 'bg-info text-white' });
        
        this.applyFiltersAndSort();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur:', err);
        this.toastService.show('Erreur lors du chargement des commentaires.', { classname: 'bg-danger text-white' });
      }
    });
  }

  applyFiltersAndSort() {
    // Filtrer par recherche
    let filtered = this.userReviews.filter(review =>
      review.movie.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Trier
    if (this.sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime());
    } else if (this.sortBy === 'rating') {
      filtered.sort((a, b) => b.rate - a.rate);
    }

    this.filteredReviews = filtered;
  }

  onSearchChange() {
    this.applyFiltersAndSort();
  }

  onSortChange() {
    this.applyFiltersAndSort();
  }

  startEdit(review: Review) {
    this.editingReviewId = review.id;
    this.editText = review.text;
    this.editRate = review.rate;
  }

  cancelEdit() {
    this.editingReviewId = null;
    this.editText = '';
    this.editRate = 0;
  }

  saveEdit(review: Review) {
    // Validation
    if (!this.editText || this.editText.trim() === '') {
      this.toastService.show('Le commentaire ne peut pas être vide.', { classname: 'bg-danger text-white' });
      return;
    }

    if (this.editRate < 1 || this.editRate > 5) {
      this.toastService.show('La note doit être entre 1 et 5.', { classname: 'bg-danger text-white' });
      return;
    }

    this.updateLoading = true;

    const updatedReview: Review = {
      ...review,
      text: this.editText,
      rate: this.editRate
    };

    this.reviewService.updateReview(updatedReview).subscribe({
      next: (response) => {
        this.updateLoading = false;
        // Mettre à jour la liste locale
        const index = this.userReviews.findIndex(r => r.id === review.id);
        if (index !== -1) {
          this.userReviews[index] = response;
        }
        this.applyFiltersAndSort();
        this.editingReviewId = null;
        this.toastService.show('Commentaire modifié avec succès !', { classname: 'bg-success text-white' });
      },
      error: (err) => {
        this.updateLoading = false;
        this.toastService.show('Erreur lors de la modification.', { classname: 'bg-danger text-white' });
      }
    });
  }

  deleteReview(reviewId: number) {
    this.reviewService.deleteReview(reviewId).subscribe({
      next: () => {
        this.userReviews = this.userReviews.filter(r => r.id !== reviewId);
        this.applyFiltersAndSort();
        this.toastService.show('Commentaire supprimé !', { classname: 'bg-success text-white' });
      },
      error: (err) => {
        this.toastService.show('Erreur lors de la suppression.', { classname: 'bg-danger text-white' });
      }
    });
  }

  getAverageRating(): number {
    if (this.userReviews.length === 0) return 0;
    const sum = this.userReviews.reduce((acc, review) => acc + review.rate, 0);
    return Math.round((sum / this.userReviews.length) * 10) / 10;
  }
}