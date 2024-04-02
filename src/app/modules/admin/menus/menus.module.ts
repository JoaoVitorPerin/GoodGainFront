import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenusRoutingModule } from './menus-routing.module';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CadastroMenusComponent } from './cadastro-menus/cadastro-menus.component';
import { HomeMenusComponent } from './home-menus/home-menus.component';
import { RouterModule } from '@angular/router';
import { DatagridModule } from 'src/app/shared/components/datagrid/datagrid.module';
import { ModalConfirmacaoModule } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.module';
import { TreeListModule } from 'src/app/shared/components/treelist/treelist.module';

@NgModule({
  declarations: [
    CadastroMenusComponent,
    HomeMenusComponent,
    
  ],
  imports: [
    CommonModule,
    MenusRoutingModule,
    FormModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    RouterModule,
    DatagridModule,
    ModalConfirmacaoModule,
    TreeListModule
  ]
})
export class MenusModule { }
