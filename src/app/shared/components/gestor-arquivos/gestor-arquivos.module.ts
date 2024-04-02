import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// components
import { GestorArquivosComponent } from './gestor-arquivos.component';
import { GestorArquivoComponent } from './arquivo/arquivo.component';
import { MenuOpcoesArquivoComponent } from './menu-opcoes/menu-opcoes.component';
import { ModalCadastroArquivoComponent } from './modal-cadastro/modal-cadastro.component';

// filepond
import { FilePondModule } from 'ngx-filepond';

// primeNG
import { SelectionBoxModule } from '../selection-box/selection-box.module';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from "primeng/button";
import { FormModule } from '../form/form.module';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [
    GestorArquivosComponent,

    GestorArquivoComponent,
    MenuOpcoesArquivoComponent,
    ModalCadastroArquivoComponent,
  ],
  imports: [
    FilePondModule,

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectionBoxModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    FormModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule
  ],
  exports: [
    GestorArquivosComponent,
  ],
})
export class GestorArquivosModule { }
