import { VersoesRoutingModule } from './versoes-routing.module'; 
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CadastroVersoesComponent } from './cadastro-versoes/cadastro-versoes.component'; 
import { HomeVersoesComponent } from './home-versoes/home-versoes.component'; 
import { RouterModule } from '@angular/router';
import { DatagridModule } from 'src/app/shared/components/datagrid/datagrid.module';
import { ModalConfirmacaoModule } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.module';

@NgModule({
  declarations: [
    CadastroVersoesComponent,
    HomeVersoesComponent,
  ],
  imports: [
    CommonModule,
    VersoesRoutingModule,
    FormModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    RouterModule,
    DatagridModule,
    ModalConfirmacaoModule
  ]
})
export class VersoesModule { }
