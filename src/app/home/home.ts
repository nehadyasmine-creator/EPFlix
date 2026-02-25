import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { MoviesApi } from '../services/movies-api';
import { Movie } from '../models/movies';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MovieCard } from './movie-card/movie-card';
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-home',
  imports: [AsyncPipe, DatePipe, MovieCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Home {
  private readonly moviesApi = inject(MoviesApi)
  movies$: Observable<Movie[]> = this.moviesApi.getMovies()
  
}
