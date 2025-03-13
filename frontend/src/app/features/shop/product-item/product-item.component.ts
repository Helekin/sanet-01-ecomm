import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Product } from '../../../shared/models/products';

@Component({
  selector: 'app-product-item',
  imports: [MatIconModule, CurrencyPipe, RouterLink],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css',
})
export class ProductItemComponent {
  @Input() product?: Product;
}
