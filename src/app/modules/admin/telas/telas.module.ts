import { TelasRoutingModule } from './telas-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CadastroTelasComponent } from './cadastro-telas/cadastro-telas.component';
import { HomeTelasComponent } from './home-telas/home-telas.component';
import { RouterModule } from '@angular/router';
import { DatagridModule } from 'src/app/shared/components/datagrid/datagrid.module';
import { ModalConfirmacaoModule } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.module';

@NgModule({
  declarations: [
    CadastroTelasComponent,
    HomeTelasComponent,
  ],
  imports: [
    CommonModule,
    TelasRoutingModule,
    FormModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    RouterModule,
    DatagridModule,
    ModalConfirmacaoModule
  ]
})
export class TelasModule { }
