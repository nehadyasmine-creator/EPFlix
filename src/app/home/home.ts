import { Component, inject, CUSTOM_ELEMENTS_SCHEMA , signal} from '@angular/core';
import { MoviesApi } from '../services/movies-api';
import { Movie } from '../models/movies';
import { Observable, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MovieCard } from './movie-card/movie-card';
import { MovieCardCarousel } from './movie-card-carousel/movie-card-carousel';
import { register } from 'swiper/element/bundle';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service';


register();
@Component({
  selector: 'app-home',
  imports: [AsyncPipe, MovieCard, MovieCardCarousel, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Home {
  private readonly moviesApi = inject(MoviesApi)
  private readonly authService = inject(AuthService)
  movies$: Observable<Movie[]> = this.moviesApi.getMovies()
  isLoggedIn = false;
  private authSubscriptions = new Subscription();
  isLoading =signal<boolean>(true);
  showCookieBanner: boolean = true;

  ngOnInit() {
    setTimeout(() => {
      this.isLoading.set(false);
    }, 150); 
    
    this.syncAuthState();
    this.authSubscriptions.add(this.authService.isLoggedIn$.subscribe(() => this.syncAuthState()));
    this.authSubscriptions.add(this.authService.currentUser$.subscribe(() => this.syncAuthState()));
  }

  ngOnDestroy() {
    this.authSubscriptions.unsubscribe();
  }

  private syncAuthState() {
    this.isLoggedIn = this.authService.isLoggedIn() && !!this.authService.getCurrentUser();
  }
  
}