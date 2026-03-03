import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Movie } from '../../models/movies';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-movie-card-carousel',
  imports: [RouterLink, DatePipe],
  templateUrl: './movie-card-carousel.html',
  styleUrl: './movie-card-carousel.scss',
})
export class MovieCardCarousel {
  @Input({required: true}) movie!: Movie;

  getMovieUrl(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-');
  }
}
