import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestorArquivosModule } from 'src/app/shared/components/gestor-arquivos/gestor-arquivos.module';

import { GestaoArquivosRoutingModule } from './gestao-arquivos-routing.module';
import { GestaoArquivosComponent } from './gestao-arquivos.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    GestaoArquivosComponent,

    HomeComponent
  ],
  imports: [
    GestaoArquivosRoutingModule,
    CommonModule,
    GestorArquivosModule
  ]
})
export class GestaoArquivosModule { }
