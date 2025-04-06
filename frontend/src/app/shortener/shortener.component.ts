import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-shortener',
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './shortener.component.html',
  styleUrls: ['./shortener.component.css']
})
export class ShortenerComponent {
  originalUrl = '';
  shortUrl: string | null = null;

  constructor(private http: HttpClient) { }

  shortenUrl() {
    this.http
      .post<{ shortCode: string }>('http://localhost:3000/shorten', {
        originalUrl: this.originalUrl
      })
      .subscribe({
        next: (response) => {
          this.shortUrl = `http://localhost:3000/${response.shortCode}`;
        },
        error: (err) => {
          console.error('Error shortening URL:', err);
          this.shortUrl = null;
        }
      });
  }

}
