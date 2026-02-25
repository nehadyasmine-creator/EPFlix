import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Movie } from '../models/movies';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoviesApi {
  private readonly httpClient = inject(HttpClient)
  private readonly url = "http://localhost:8080/movies"
  
  getMovies(): Observable<Movie[]> {
    return this.httpClient.get<Movie[]>(this.url);
  }

  getMovie(id: number): Observable<Movie> {
    return this.httpClient.get<Movie>(`${this.url}/${id}`);
  }

  addMovie(movie: Movie): Observable<Movie> {
    return this.httpClient.post<Movie>(this.url, movie);
  }

  deleteMovie(id: number): Observable<void> { 
    return this.httpClient.delete<void>(`${this.url}/${id}`);
  }

  updateMovie(movie: Movie): Observable<Movie> {
    return this.httpClient.put<Movie>(`${this.url}/${movie.id}`, movie);
}
}
