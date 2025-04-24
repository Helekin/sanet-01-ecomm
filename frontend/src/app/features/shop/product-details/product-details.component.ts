import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

import { ShopService } from '../../../core/services/shop.service';
import { Product } from '../../../shared/models/products';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-details',
  imports: [
    CurrencyPipe,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  private shopService = inject(ShopService);
  private activatedRoute = inject(ActivatedRoute);
  private cartService = inject(CartService);

  product?: Product;
  quantityInCart = 0;
  quantity = 1;

  ngOnInit(): void {
    this.loadProduct();
  }

  async loadProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;

    const product = await lastValueFrom(this.shopService.getProduct(+id));
    this.product = product;

    await this.waitForCart();

    this.updateQuantityInCart();
  }

  updateCart() {
    if (!this.product) return;

    if (this.quantity > this.quantityInCart) {
      const itemsToAdd = this.quantity - this.quantityInCart;
      this.quantityInCart += itemsToAdd;
      this.cartService.addItemToCart(this.product, itemsToAdd);
    } else {
      const itemsToRemove = this.quantityInCart - this.quantity;
      this.quantityInCart -= itemsToRemove;
      this.cartService.removeItemFromCart(this.product.id, itemsToRemove);
    }
  }

  updateQuantityInCart() {
    this.quantityInCart =
      this.cartService
        .cart()
        ?.items.find((x) => x.productId === this.product?.id)?.quantity || 0;

    this.quantity = this.quantityInCart || 1;
  }

  getButtonText() {
    return this.quantityInCart > 0 ? 'Actualizar carrito' : 'Añadir al carrito';
  }

  private async waitForCart(timeout = 3000) {
    const pollInterval = 50;
    let waited = 0;

    while (!this.cartService.cart() && waited < timeout) {
      await new Promise((res) => setTimeout(res, pollInterval));
      waited += pollInterval;
    }
  }
}
