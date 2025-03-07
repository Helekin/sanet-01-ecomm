import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { ShopService } from '../../core/services/shop.service';
import { ProductItemComponent } from './product-item/product-item.component';

@Component({
  selector: 'app-shop',
  imports: [MatCardModule, ProductItemComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  private shopService = inject(ShopService);

  products: any[] = [];

  ngOnInit(): void {
    this.shopService.getProducts().subscribe({
      next: (response) => (this.products = response.data),
      error: (error) => console.log(error),
    });
  }
}
