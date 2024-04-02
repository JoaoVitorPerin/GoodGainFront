import { InputNumberModule } from 'primeng/inputnumber';
import { NoFormComponent } from './no-form.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [NoFormComponent],
  imports: [
    CommonModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    InputNumberModule
  ],
  exports: [
    NoFormComponent
  ]
})
export class NoFormModule { }
