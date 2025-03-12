import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectionList, MatListOption } from '@angular/material/list';

import { ShopService } from '../../../core/services/shop.service';

@Component({
  selector: 'app-filters-dialog',
  imports: [MatDividerModule, MatSelectionList, MatListOption],
  templateUrl: './filters-dialog.component.html',
  styleUrl: './filters-dialog.component.css',
})
export class FiltersDialogComponent {
  shopService = inject(ShopService);
}
