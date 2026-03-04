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
  const startsWithUpper = /^[A-Z]/.test(this.movie.title);
  
  const twoWordsRegex = /^\s*[^\s]+\s+[^\s]+\s*$/;
  const isDirectorValid = twoWordsRegex.test(this.movie.director);


  if (!this.movie.title || !startsWithUpper) {
    this.toastService.show('Le titre doit commencer par une majuscule.', { 
      classname: 'bg-danger text-white' 
    });
    return; 
  }

  if (!this.movie.director || !isDirectorValid) {
    this.toastService.show('Le réalisateur doit comporter exactement deux mots (Prénom Nom).', { 
      classname: 'bg-danger text-white' 
    });
    return;
  }

  if (!this.movie.synopsis || this.movie.synopsis.length < 30) {
    this.toastService.show('Le synopsis doit faire au moins 30 caractères.', { 
      classname: 'bg-danger text-white' 
    });
    return;
  }

  const today = new Date();
  const releaseDate = new Date(this.movie.releaseDate);

  if (releaseDate > today) {
    this.toastService.show("La date de sortie ne peut pas être dans le futur.", { 
      classname: 'bg-danger text-white' 
    });
    return;
  }

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
