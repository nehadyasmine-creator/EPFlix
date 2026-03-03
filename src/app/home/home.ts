import { Component, inject, CUSTOM_ELEMENTS_SCHEMA , signal} from '@angular/core';
import { MoviesApi } from '../services/movies-api';
import { Movie } from '../models/movies';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MovieCard } from './movie-card/movie-card';
import { MovieCardCarousel } from './movie-card-carousel/movie-card-carousel';
import { register } from 'swiper/element/bundle';


register();
@Component({
  selector: 'app-home',
  imports: [AsyncPipe, DatePipe, MovieCard, MovieCardCarousel],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Home {
  private readonly moviesApi = inject(MoviesApi)
  movies$: Observable<Movie[]> = this.moviesApi.getMovies()

  isLoading =signal<boolean>(true);

  ngOnInit() {
    setTimeout(() => {
      this.isLoading.set(false);
    }, 150); 
  }
}
  
