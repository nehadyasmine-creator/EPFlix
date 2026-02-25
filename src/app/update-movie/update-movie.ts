import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../models/movies';
import { MoviesApi } from '../services/movies-api';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastService } from '../services/toast';
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
  private toastService = inject(ToastService);

  movie!: Movie;
  isToastVisible: boolean = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.moviesApi.getMovie(Number(id)).subscribe(movie => this.movie = movie);
  }

  updateMovie(): void {
    this.moviesApi.updateMovie(this.movie).subscribe(() => {
      this.toastService.show('Le film a été mis à jour avec succès !', { 
      classname: 'bg-success text-white' 
    });
      this.router.navigate(['/movies']);

    });
  }


}
