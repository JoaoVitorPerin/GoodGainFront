import { UsuariosHomeComponent } from './usuarios-home/usuarios-home.component';
import { UsuariosCadastroComponent } from './usuarios-cadastro/usuarios-cadastro.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { CardModule } from 'primeng/card';
import { UsuariosComponent } from './usuarios.component';
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

@NgModule({
  declarations: [
    UsuariosComponent,
    UsuariosHomeComponent,
    UsuariosCadastroComponent,
  ],
  imports: [
    CommonModule,
    TooltipModule,
    UsuariosRoutingModule,
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
export class UsuariosModule { }
