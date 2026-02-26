import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Review } from '../models/reviews';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly httpClient = inject(HttpClient);
  private readonly url = 'http://localhost:8080/reviews'; 

  getReviews(): Observable<Review[]> {
    return this.httpClient.get<Review[]>(this.url);
  }

  getReviewsByUser(userId: number): Observable<Review[]> {
    return this.httpClient.get<Review[]>(`${this.url}?userId=${userId}`);
    }

  getReviewsByMovie(movieId: number): Observable<Review[]> {
    return this.httpClient.get<Review[]>(`${this.url}?movieId=${movieId}`);
  }

  addReview(review: Review): Observable<Review> {
    return this.httpClient.post<Review>(this.url, review);
  }

  deleteReview(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`);
  }

  updateReview(review: Review): Observable<Review> {
    return this.httpClient.put<Review>(`${this.url}/${review.id}`, review);
  }
}