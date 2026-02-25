import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Home } from './home/home';
import { MovieList } from './movie-list/movie-list';

@Component({
  selector: 'app-root',
  imports: [Navbar, Home, MovieList, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Netflix');
}
