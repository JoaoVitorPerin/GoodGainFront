import { AtalhoEventoDirective } from 'src/app/shared/directives/atalho-evento.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalConfirmacaoComponent } from './modal-confirmacao.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from "primeng/button";

@NgModule({
  imports: [
    CommonModule,
    ConfirmDialogModule,
    ButtonModule,
    AtalhoEventoDirective
  ],
  exports: [ModalConfirmacaoComponent],
  declarations: [ModalConfirmacaoComponent]
})
export class ModalConfirmacaoModule { }
