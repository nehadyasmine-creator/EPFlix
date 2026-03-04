import { Component, inject, CUSTOM_ELEMENTS_SCHEMA , signal,  AfterViewInit} from '@angular/core';
import { MoviesApi } from '../services/movies-api';
import { Movie } from '../models/movies';
import { Observable, Subscription } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MovieCard } from './movie-card/movie-card';
import { MovieCardCarousel } from './movie-card-carousel/movie-card-carousel';
import { register } from 'swiper/element/bundle';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service';

import { DomSanitizer } from '@angular/platform-browser';


register();
@Component({
  selector: 'app-home',
  imports: [AsyncPipe, DatePipe, MovieCard, MovieCardCarousel, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Home implements AfterViewInit{
  private readonly moviesApi = inject(MoviesApi)
  private readonly authService = inject(AuthService)
  movies$: Observable<Movie[]> = this.moviesApi.getMovies()
  isLoggedIn = false;
  private authSubscriptions = new Subscription();
  isLoading =signal<boolean>(true);
  private sanitizer = inject(DomSanitizer);

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

  getSafeUrl(url: string) {
  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}

ngAfterViewInit() {
    // On attend un court instant après le chargement du DOM
    setTimeout(() => {
      const swipers = document.querySelectorAll('swiper-container');
      swipers.forEach((swiper: any) => {
        // Cette commande force Swiper à "lire" ses attributs et ses boutons
        if (swiper.initialize) {
          swiper.initialize();
        }
      });
    }, 200); // 200ms suffisent pour laisser le @if rendre le HTML
  }

}