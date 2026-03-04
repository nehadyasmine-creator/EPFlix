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
  @Input({required: true}) movie!: Movie;
  isExpanded = false;

  getMovieUrl(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-');
  }

  toggleExpand(event: Event) {
    event.stopPropagation(); // Empêche de déclencher le [routerLink] de la card
    this.isExpanded = !this.isExpanded;
  }
}
