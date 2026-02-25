import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Movie } from '../../models/movies';
@Component({
  selector: 'app-movie-card-carousel',
  imports: [],
  templateUrl: './movie-card-carousel.html',
  styleUrl: './movie-card-carousel.scss',
})
export class MovieCardCarousel {
  @Input({required: true}) movie!: Movie;
}
