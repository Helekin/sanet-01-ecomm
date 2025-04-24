import { Component, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { CartItem } from '../../../shared/models/cart';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-item',
  imports: [RouterLink, MatIconModule, CurrencyPipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
})
export class CartItemComponent {
  item = input.required<CartItem>();
  cartService = inject(CartService);

  incrementQuantity() {
    this.cartService.addItemToCart(this.item());
  }

  decrementQuantity() {
    this.cartService.removeItemFromCart(this.item().productId);
  }

  removeItemFromCart() {
    this.cartService.removeItemFromCart(
      this.item().productId,
      this.item().quantity
    );
  }
}
