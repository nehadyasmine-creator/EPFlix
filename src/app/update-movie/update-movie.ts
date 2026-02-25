import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../models/movies';
import { MoviesApi } from '../services/movies-api';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-update-movie',
  imports: [FormsModule, DatePipe, RouterLink],
  templateUrl: './update-movie.html',
  styleUrl: './update-movie.scss',
})

export class UpdateMovie {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private moviesApi = inject(MoviesApi);

  movie!: Movie;

  ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id');
      this.moviesApi.getMovie(Number(id)).subscribe(movie => this.movie = movie);
  }

  updateMovie(): void {
      this.moviesApi.updateMovie(this.movie).subscribe(
          () => this.router.navigate(['/movies'])
      );
  }
}
