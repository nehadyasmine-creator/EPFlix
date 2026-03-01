import { Routes } from '@angular/router';
import { Home } from './home/home';
import { MovieList } from './movie-list/movie-list';
import { AddMovie } from './add-movie/add-movie';
import { UpdateMovie } from './update-movie/update-movie';
import { Register } from './register/register';
import { Profil } from './profil/profil';
import { MyReviews } from './myreviews/myreviews';
import { AddReview } from './add-review/add-review';
import { MovieDetailComponent } from './movie-details/movie-details';
import { Admin } from './admin/admin';

export const routes: Routes = [
    { path: '', component: Home},
    
    { path: 'movies', component: MovieList},
    { path: 'add-movie', component: AddMovie},
    { path: 'update-movie/:id', component: UpdateMovie },
    { path: 'register', component: Register },
    { path: 'profil', component: Profil },
    { path: 'myreviews', component: MyReviews },
    { path: 'add-review', component: AddReview },
    { path: 'movies/:name', component: MovieDetailComponent },
    { path: 'admin', component: Admin}
];

