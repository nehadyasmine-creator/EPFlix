import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Input } from '@angular/core';
import { Movie } from '../models/movies';
import { Observable } from 'rxjs';
import { MoviesApi } from '../services/movies-api';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ToastService } from '../services/toast';


@Component({
  selector: 'app-add-movie',
  imports: [FormsModule, RouterLink],
  templateUrl: './add-movie.html',
  styleUrl: './add-movie.scss',
})
export class AddMovie {
  private readonly moviesApi = inject(MoviesApi)
  movies$: Observable<Movie[]> = this.moviesApi.getMovies()

  private readonly router = inject(Router)
  private toastService = inject(ToastService);
  
  movie: Movie = {
    title: '',
    releaseDate: new Date(),
    director: '',
    synopsis: '',
    rate: 0
  }
  isToastVisible: boolean = false;
  
  addMovie(): void {
    this.moviesApi.addMovie(this.movie).subscribe(
        () => {
          this.toastService.show('Le film a été ajouté avec succès !', { 
            classname: 'bg-success text-white' 
          });
          this.router.navigate(['/movies']);
        }
    );
  }

}
