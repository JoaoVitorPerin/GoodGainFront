import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionBoxComponent } from './dynamic/selection-box.component';
import { SelectionBoxDirective } from './selection-box.directive';
import { SelectionDraggingPlaceholderComponent } from './dynamic/selection-dragging-placeholder.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SelectionBoxComponent,
    SelectionDraggingPlaceholderComponent,
    SelectionBoxDirective
  ],
  exports: [SelectionBoxDirective],
})
export class SelectionBoxModule { }
