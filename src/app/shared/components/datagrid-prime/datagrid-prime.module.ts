import { ColorPickerModule } from 'primeng/colorpicker';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { DatagridActionsComponent } from './../datagrid-actions/datagrid-actions.component';
import { InputMaskModule } from 'primeng/inputmask';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
//Core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Components
import { DatagridPrimeComponent } from './datagrid-prime.component';
import { LoaderModule } from 'src/app/shared/components/loader/loader.module';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from "@angular/forms";
import { TreeSelectModule } from 'primeng/treeselect';

@NgModule({
  imports: [
    CommonModule,
    TooltipModule,
    LoaderModule,
    ButtonModule,
    TableModule,
    ToolbarModule,
    InputTextModule,
    InputNumberModule,
    FormsModule,
    CheckboxModule,
    InputMaskModule,
    DatagridActionsComponent,
    DropdownModule,
    MultiSelectModule,
    CalendarModule,
    TreeSelectModule,
    ColorPickerModule
  ],
  exports: [DatagridPrimeComponent],
  declarations: [
    DatagridPrimeComponent,
  ]
})
export class DatagridPrimeModule { }
