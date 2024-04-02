import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CadastroAdminComponent } from './cadastro-admin/cadastro-admin.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { AdminGestaoArquivosComponent } from './admin-gestao-arquivos.component';
import { DatagridModule } from 'src/app/shared/components/datagrid/datagrid.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { MenusModule } from '../admin/menus/menus.module';
import { TelasModule } from '../admin/telas/telas.module';
import { VersoesModule } from '../admin/versoes/versoes.module';
import { AdminRoutingModule } from './admin-gestao-arquivos-routing.module';



@NgModule({
  declarations: [
    AdminGestaoArquivosComponent,
    HomeAdminComponent,
    CadastroAdminComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AdminRoutingModule,
    DatagridModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    FormModule,
    DatagridModule,
    MenusModule,
    TelasModule,
    VersoesModule

  ]
})
export class AdminGestaoArquivosModule { }
