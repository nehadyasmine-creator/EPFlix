import { Component, inject, DestroyRef, signal, computed } from '@angular/core';
import { Movie } from '../models/movies';
import { DatePipe } from '@angular/common';
import { MoviesApi } from '../services/movies-api';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-movie-list',
  imports: [DatePipe, RouterLink],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss',
})

export class MovieList {
  private readonly moviesApi = inject(MoviesApi)
  private destroyRef = inject(DestroyRef);
  
  movies = signal<Movie[]>([]);
  searchTerm = signal('');

  filteredMovies = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.movies();
    }
    return this.movies().filter(m => m.title.toLowerCase().includes(term) || m.director.toLowerCase().includes(term));
  });

  ngOnInit(): void {
      this.moviesApi.getMovies().subscribe(movies => this.movies.set(movies));
      // listen to query param changes
      this.route.queryParams.subscribe(params => {
        this.searchTerm.set(params['search'] || '');
      });
  }

  

  deleteMovie(id: number): void {
    this.moviesApi.deleteMovie(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => 
        this.movies.update(current => current.filter(film => film.id !== id))
    );
}

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  updateMovie(id: number): void {
      this.router.navigate(['/update-movie', id]);
  }
}