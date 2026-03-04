import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth-service';
import { ReviewService } from '../services/review-service';
import { Review } from '../models/reviews';
import { ToastService } from '../services/toast';
import { User } from '../models/users';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-myreviews',
  // ReviewChartComponent a été retiré d'ici
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
  sortBy: string = 'recent'; 

  editingReviewId: number | null = null;
  editText: string = '';
  editRate: number = 0;
  updateLoading: boolean = false;

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

    this.loadReviews();
  }

  loadReviews() {
    this.loading = true;
    if (!this.currentUser) {
      this.toastService.show('Veuillez vous connecter.', { classname: 'bg-danger text-white' });
      this.loading = false;
      return;
    }


    this.reviewService.getReviews().subscribe({
      next: (allReviews: Review[]) => {
        
        this.userReviews = allReviews.filter(review => {
          console.log(`Comparaison email: ${review.user.email} === ${this.currentUser!.email}`);
          return review.user.email === this.currentUser!.email;
        });
        
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
    let filtered = this.userReviews.filter(review =>
      review.movie.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

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
  getMovieUrl(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-');
  }
}