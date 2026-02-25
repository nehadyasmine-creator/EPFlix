import { Routes } from '@angular/router';
import { Home } from './home/home';
import { MovieList } from './movie-list/movie-list';
import { AddMovie } from './add-movie/add-movie';
import { UpdateMovie } from './update-movie/update-movie';

export const routes: Routes = [
    { path: '', component: Home},
    { path: 'movies', component: MovieList},
    { path: 'add-movie', component: AddMovie},
    { path: 'update-movie/:id', component: UpdateMovie }
];

