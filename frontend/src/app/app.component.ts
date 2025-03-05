import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HeaderComponent } from './layout/header/header.component';
import { Pagination } from './shared/models/pagination';
import { Product } from './shared/models/products';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  baseUrl = 'http://localhost:5000/api/';
  title = 'frontend';
  products: any[] = [];

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.http.get<Pagination<Product>>(this.baseUrl + 'products').subscribe({
      next: (response) => (this.products = response.data),
      error: (error) => console.log(error),
      complete: () => console.log('complete'),
    });
  }
}
