import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Pagination } from '../../shared/models/pagination';
import { Product } from '../../shared/models/products';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = 'http://localhost:5000/api/';

  private http = inject(HttpClient);

  getProducts() {
    return this.http.get<Pagination<Product>>(this.baseUrl + 'products?pageSize=10');
  }
}
