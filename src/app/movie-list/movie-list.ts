import { Component, inject, DestroyRef, signal, computed, OnInit } from '@angular/core';
import { Movie } from '../models/movies';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MoviesApi } from '../services/movies-api';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-movie-list',
  standalone: true, // Assurez-vous d'être en standalone si nécessaire
  imports: [DatePipe, RouterLink, DecimalPipe],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss',
})
export class MovieList implements OnInit {
  private readonly moviesApi = inject(MoviesApi);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  movies = signal<Movie[]>([]);
  searchTerm = signal('');
  
  // --- Nouveaux Signaux pour le Tri et le Filtrage ---
  sortKey = signal<string>('title');
  sortDirection = signal<'asc' | 'desc'>('asc');
  minRate = signal<number>(0); // Nouveau signal pour la note

  // 1. Filtrage (Recherche + Note)
  filteredMovies = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const minR = this.minRate();
    
    return this.movies().filter(m => {
      const matchesSearch = !term || 
                            m.title.toLowerCase().includes(term) || 
                            m.director.toLowerCase().includes(term);
      const matchesRate = m.rate! >= minR;
      
      return matchesSearch && matchesRate;
    });
  });

  // 2. Tri (Basé sur le résultat filtré)
  sortedMovies = computed(() => {
    const movies = [...this.filteredMovies()]; 
    const key = this.sortKey();
    const direction = this.sortDirection() === 'asc' ? 1 : -1;

    return movies.sort((a, b) => {
      const valA = (a as any)[key];
      const valB = (b as any)[key];

      if (valA < valB) return -1 * direction;
      if (valA > valB) return 1 * direction;
      return 0;
    });
  });

  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.isLoading.set(true);
    this.moviesApi.getMovies()
      .pipe(finalize(() => this.isLoading.set(false))
    )
      .subscribe(movies => this.movies.set(movies));
    
    this.route.queryParams
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(params => {
      this.searchTerm.set(params['search'] || '');
    });
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  // Méthode pour le changement du curseur de note
  onRateFilterChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.minRate.set(Number(input.value));
  }

  // Méthode pour le changement via la liste déroulante
  onSortChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.setSort(selectElement.value);
  }

  setSort(key: string) {
    if (this.sortKey() === key) {
      this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDirection.set('asc');
    }
  }

  deleteMovie(id: number): void {
    this.moviesApi.deleteMovie(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => 
      this.movies.update(current => current.filter(film => film.id !== id))
    );
  }

  updateMovie(id: number): void {
    this.router.navigate(['/update-movie', id]);
  }

  getMovieUrl(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-');
  }

  isAdmin() {
  return sessionStorage.getItem('admin_access') === 'true';
}



}