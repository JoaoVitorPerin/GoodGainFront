import { DatagridModule } from './../../../shared/components/datagrid/datagrid.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { ButtonModule } from 'primeng/button';
import { PerfisComponent } from './perfis.component';
import { HomePerfisComponent } from './home-perfis/home-perfis.component';
import { CadastroPerfisComponent } from './cadastro-perfis/cadastro-perfis.component';
import { PerfisRoutingModule } from './perfis-routing.module';
@NgModule({
  declarations: [
    PerfisComponent,
    HomePerfisComponent,
    CadastroPerfisComponent
  ],
  imports: [
    CommonModule,
    PerfisRoutingModule,
    CardModule,
    DatagridModule,
    ReactiveFormsModule,
    FormModule,
    ButtonModule
  ]
})
export class PerfisModule { }
