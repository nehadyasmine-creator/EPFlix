import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Input } from '@angular/core';
import { Movie } from '../models/movies';
import { Observable } from 'rxjs';
import { MoviesApi } from '../services/movies-api';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-movie',
  imports: [FormsModule],
  templateUrl: './add-movie.html',
  styleUrl: './add-movie.scss',
})
export class AddMovie {
  private readonly moviesApi = inject(MoviesApi)
  movies$: Observable<Movie[]> = this.moviesApi.getMovies()

  private readonly router = inject(Router)
  
  movie: Movie = {
    title: '',
    releaseDate: new Date(),
    director: '',
    synopsis: '',
    rate: 0
  }
  
  addMovie(): void {
    this.moviesApi.addMovie(this.movie).subscribe(
        () => this.router.navigate(['/movies'])
    );
  }

}
