import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Movie } from '../../models/movies';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  imports: [RouterLink],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
})
export class MovieCard {
  @Input({required: true}) movie!: Movie

  getMovieUrl(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-');
  }
}
