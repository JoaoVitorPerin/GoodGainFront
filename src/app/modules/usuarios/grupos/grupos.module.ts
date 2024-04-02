import { DatagridModule } from './../../../shared/components/datagrid/datagrid.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { ButtonModule } from 'primeng/button';
import { GruposComponent } from './grupos.component';
import { HomeGruposComponent } from './home-grupos/home-grupos.component';
import { CadastroGruposComponent } from './cadastro-grupos/cadastro-grupos.component';
import { GruposRoutingModule } from './grupos-routing.module';
@NgModule({
  declarations: [
    GruposComponent,
    HomeGruposComponent,
    CadastroGruposComponent
  ],
  imports: [
    CommonModule,
    GruposRoutingModule,
    CardModule,
    DatagridModule,
    ReactiveFormsModule,
    FormModule,
    ButtonModule
  ]
})
export class GruposModule { }
