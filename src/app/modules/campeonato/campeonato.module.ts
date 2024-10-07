import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DatagridModule } from './../../shared/components/datagrid/datagrid.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from './../../shared/components/form/form.module';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DatagridPrimeModule } from 'src/app/shared/components/datagrid-prime/datagrid-prime.module';
import { TooltipModule } from 'primeng/tooltip';
import { TabMenuModule } from 'primeng/tabmenu';
import { CampeonatoComponent } from './campeonato.component';
import { HomeComponent } from './home/home.component';
import { CampeonatoRoutingModule } from './campeonato-routing.module';

@NgModule({
  declarations: [
    CampeonatoComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    TooltipModule,
    CampeonatoRoutingModule,
    CardModule,
    DatagridModule,
    ReactiveFormsModule,
    FormModule,
    ButtonModule,
    TableModule,
    ToolbarModule,
    InputTextModule,
    DatagridPrimeModule,
    TabMenuModule
  ]
})
export class CampeonatoModule { }
