import { Component, inject, DestroyRef, signal } from '@angular/core';
import { Movie } from '../models/movies';
import { DatePipe } from '@angular/common';
import { MoviesApi } from '../services/movies-api';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';


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
  

  ngOnInit(): void {
      this.moviesApi.getMovies().subscribe(movies => this.movies.set(movies));
  }

  deleteMovie(id: number): void {
    this.moviesApi.deleteMovie(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => 
        this.movies.update(current => current.filter(film => film.id !== id))
    );
}

  private router = inject(Router);

  updateMovie(id: number): void {
      this.router.navigate(['/update-movie', id]);
  }
}