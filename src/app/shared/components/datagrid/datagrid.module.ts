//Core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

//Devextreme
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxCheckBoxModule , DxPopoverModule, DxListModule, DxPopupModule, DxButtonModule, DxProgressBarModule, DxFileUploaderModule, DxPieChartModule, DxChartModule, DxHtmlEditorModule, DxSortableModule, DxScrollViewModule, DxTooltipModule } from 'devextreme-angular';
import { locale, loadMessages } from 'devextreme/localization';
import ptMessages from 'devextreme/localization/messages/pt.json';

//Components
import { DatagridComponent } from './datagrid.component';
import { ColumnChooserComponent } from './../column.chooser/column.chooser.component';
import { LoaderModule } from 'src/app/shared/components/loader/loader.module';
import { NoFormModule } from "../no-form/no-form.module";
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayPanelModule } from 'primeng/overlaypanel';

loadMessages(ptMessages);
locale(navigator.language);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NoFormModule,
    DxDataGridModule,
    DxCheckBoxModule,
    DxPopupModule,
    DxPopoverModule,
    DxListModule,
    DxButtonModule,
    DxProgressBarModule,
    DxFileUploaderModule,
    DxPieChartModule,
    DxChartModule,
    DxHtmlEditorModule,
    DxSortableModule,
    DxScrollViewModule,
    DxTooltipModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    DropdownModule,
    MultiSelectModule,
    ButtonModule,
    TooltipModule,
    OverlayPanelModule,
  ],
  exports: [DatagridComponent],
  declarations: [
    DatagridComponent,
    ColumnChooserComponent
  ]
})
export class DatagridModule { }
