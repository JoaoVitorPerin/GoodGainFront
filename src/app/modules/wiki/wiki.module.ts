
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WikiRoutingModule } from './wiki-routing.module';
import { CardModule } from 'primeng/card';
import { FormsComponent } from './forms/forms.component';
import { WikiComponent } from './wiki.component';
import { DatagridModule } from './../../shared/components/datagrid/datagrid.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from './../../shared/components/form/form.module';
import { ToastrModule } from "src/app/shared/components/toastr/toastr.module";
import { ButtonModule } from 'primeng/button';
import { TreeListModule } from 'src/app/shared/components/treelist/treelist.module';

@NgModule({
  declarations: [
    WikiComponent,
    FormsComponent
  ],
  imports: [
    CommonModule,
    WikiRoutingModule,
    CardModule,
    DatagridModule,
    ReactiveFormsModule,
    FormModule,
    ToastrModule,
    ButtonModule,
    TreeListModule
  ]
})
export class UsuariosModule { }
