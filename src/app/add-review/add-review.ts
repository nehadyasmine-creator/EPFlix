import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { MoviesApi } from '../services/movies-api';
import { ReviewService } from '../services/review-service';
import { Movie } from '../models/movies';
import { Review } from '../models/reviews';
import { User } from '../models/users';
import { ToastService } from '../services/toast';

@Component({
  selector: 'app-add-review',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-review.html',
  styleUrl: './add-review.scss',
})
export class AddReview implements OnInit {
  private authService = inject(AuthService);
  private moviesApi = inject(MoviesApi);
  private reviewService = inject(ReviewService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  currentUser: User | null = null;
  movies: Movie[] = [];
  loadingMovies: boolean = true;

  selectedMovie: Movie | null = null;
  rating: number = 0;
  reviewText: string = '';
  submitting: boolean = false;

  ngOnInit() {
    // Charger l'utilisateur une seule fois
    if (this.currentUser) {
      this.loadMovies();
      return;
    }

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.loadMovies();
    } else {
      this.toastService.show('Veuillez vous connecter.', { classname: 'bg-danger text-white' });
      this.router.navigate(['/login']);
    }
  }

  loadMovies() {
    this.loadingMovies = true;
    this.moviesApi.getMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
        this.loadingMovies = false;
      },
      error: (err) => {
        this.loadingMovies = false;
        this.toastService.show('Erreur lors du chargement des films.', { classname: 'bg-danger text-white' });
      }
    });
  }

  selectMovie(movie: Movie) {
    this.selectedMovie = movie;
    this.rating = 0;
    this.reviewText = '';
  }

  setRating(rate: number) {
    this.rating = rate;
  }

  submitReview() {
    // Validation
    if (!this.selectedMovie) {
      this.toastService.show('Veuillez sélectionner un film.', { classname: 'bg-danger text-white' });
      return;
    }

    if (this.rating === 0) {
      this.toastService.show('Veuillez donner une note.', { classname: 'bg-danger text-white' });
      return;
    }

    if (!this.reviewText || this.reviewText.trim() === '') {
      this.toastService.show('Veuillez écrire un commentaire.', { classname: 'bg-danger text-white' });
      return;
    }

    if (this.reviewText.length < 10) {
      this.toastService.show('Le commentaire doit contenir au moins 10 caractères.', { classname: 'bg-danger text-white' });
      return;
    }

    this.submitting = true;

    const newReview: Review = {
      id: 0,
      user: this.currentUser!,
      movie: {
        id: this.selectedMovie.id || 0,
        title: this.selectedMovie.title,
        director: this.selectedMovie.director,
        rate: this.selectedMovie.rate || 0,
        releaseDate: typeof this.selectedMovie.releaseDate === 'string' 
          ? this.selectedMovie.releaseDate 
          : new Date(this.selectedMovie.releaseDate).toISOString(),
        synopsis: this.selectedMovie.synopsis,
        image: this.selectedMovie.image || ''
      },
      rate: this.rating,
      text: this.reviewText,
      reviewDate: new Date().toISOString()
    };

    this.reviewService.addReview(newReview).subscribe({
      next: (review) => {
        this.submitting = false;
        this.toastService.show('Commentaire publié avec succès !', { classname: 'bg-success text-white' });
        this.router.navigate(['/myreviews']);
      },
      error: (err) => {
        this.submitting = false;
        console.error('Erreur:', err);
        this.toastService.show('Erreur lors de la publication du commentaire.', { classname: 'bg-danger text-white' });
      }
    });
  }
}