import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ShopService } from '../../../core/services/shop.service';
import { Product } from '../../../shared/models/products';

@Component({
  selector: 'app-product-details',
  imports: [
    CurrencyPipe,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  private shopService = inject(ShopService);
  private activatedRoute = inject(ActivatedRoute);

  product?: Product;
  selectedQty?: number;

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;
    this.shopService.getProduct(+id).subscribe({
      next: (product) => {
        this.product = product;

        if (this.product.quantityInStock > 0) {
          this.selectedQty = 1;
        }
      },
      error: (error) => console.log(error),
    });
  }

  getQuantityOptions(): number[] {
    if (!this.product?.quantityInStock) return [];

    return Array.from(
      { length: this.product.quantityInStock },
      (_, i) => i + 1
    );
  }
}
