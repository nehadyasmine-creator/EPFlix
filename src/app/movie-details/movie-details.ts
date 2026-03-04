import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MoviesApi } from '../services/movies-api';
import { ReviewService } from '../services/review-service';
import { Movie } from '../models/movies';
import { Review } from '../models/reviews';
import { ToastService } from '../services/toast';

@Component({
  selector: 'app-movie-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss',
})
export class MovieDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private moviesApi = inject(MoviesApi);
  private reviewService = inject(ReviewService);
  private toastService = inject(ToastService);

  movie: Movie | null = null;
  reviews: Review[] = [];
  loading: boolean = true;
  loadingReviews: boolean = true;

  ngOnInit() {
    this.loadMovie();
    this.loadReviews();
  }

  loadMovie() {
    this.loading = true;
    
    const movieName = this.route.snapshot.paramMap.get('name');
    
    if (!movieName) {
      this.toastService.show('Film non trouvé.', { classname: 'bg-danger text-white' });
      this.loading = false;
      return;
    }

    this.moviesApi.getMovies().subscribe({
      next: (movies) => {
        const found = movies.find(m => 
          m.title.toLowerCase().replace(/\s+/g, '-') === movieName.toLowerCase()
        );
        
        if (found) {
          this.movie = found;
        } else {
          this.toastService.show('Film non trouvé.', { classname: 'bg-danger text-white' });
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.toastService.show('Erreur lors du chargement du film.', { classname: 'bg-danger text-white' });
      }
    });
  }

  loadReviews() {
    this.loadingReviews = true;
    
    this.reviewService.getReviews().subscribe({
      next: (allReviews) => {
        const checkInterval = setInterval(() => {
          if (this.movie) {
            this.reviews = allReviews.filter(r => r.movie.id === this.movie!.id);
            this.loadingReviews = false;
            clearInterval(checkInterval);
          }
        }, 100);
      },
      error: (err) => {
        this.loadingReviews = false;
        this.toastService.show('Erreur lors du chargement des commentaires.', { classname: 'bg-danger text-white' });
      }
    });
  }

  getAverageRating(): number {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, review) => acc + review.rate, 0);
    return Math.round((sum / this.reviews.length) * 10) / 10;
  }
}