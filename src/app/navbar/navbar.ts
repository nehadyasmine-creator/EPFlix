import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Input } from '@angular/core';    
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [TitleCasePipe, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  @Input({ required: true }) title! : string
}
