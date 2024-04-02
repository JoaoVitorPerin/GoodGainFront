import { LocalComponent } from './local/local.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestaoVendaMaisRoutingModule } from './gestao-venda-mais-routing.module';

@NgModule({
  declarations: [
    LocalComponent
  ],
  imports: [
    CommonModule,
    GestaoVendaMaisRoutingModule,
  ]
})
export class GestaoVendaMaisModule { }
