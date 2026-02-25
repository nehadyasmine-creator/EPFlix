import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})

export class Footer {
  @Input({ required: true }) title! : string
}
