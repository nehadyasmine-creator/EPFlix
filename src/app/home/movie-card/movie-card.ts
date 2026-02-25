import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Movie } from '../../models/movies';

@Component({
  selector: 'app-movie-card',
  imports: [],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
})
export class MovieCard {
  @Input({required: true}) movie!: Movie
}
