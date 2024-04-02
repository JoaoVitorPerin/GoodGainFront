import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Devextreme
import { DxTreeListModule, DxCheckBoxModule , DxPopoverModule, DxListModule, DxPopupModule, DxButtonModule, DxProgressBarModule, DxFileUploaderModule, DxPieChartModule, DxChartModule, DxHtmlEditorModule, DxSortableModule, DxScrollViewModule, DxTooltipModule } from 'devextreme-angular';

//Components
import { TreelistComponent } from './treelist.component';
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

@NgModule({
  imports: [
    CommonModule,
    DxTreeListModule,
    DxCheckBoxModule,
    DxPopoverModule,
    DxListModule,
    DxPopupModule,
    DxButtonModule,
    DxProgressBarModule,
    DxFileUploaderModule,
    DxPieChartModule,
    DxChartModule,
    DxHtmlEditorModule,
    DxSortableModule,
    DxScrollViewModule,
    DxTooltipModule,
    LoaderModule,
    NoFormModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    DropdownModule,
    MultiSelectModule,
    ButtonModule,
    TooltipModule,
    OverlayPanelModule,
  ],
  exports: [TreelistComponent],
  declarations: [
    TreelistComponent,
  ]
})
export class TreeListModule { }
