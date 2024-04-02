
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { CardInformativoComponent } from 'src/app/shared/components/card-informativo/card-informativo.component';
import { CardModule } from 'primeng/card';
import { CadastroUsuariosComponent } from './cadastro-usuarios/cadastro-usuarios.component';
import { HomeUsuariosComponent } from './home-usuarios/home-usuarios.component';
import { UsuariosComponent } from './usuarios.component';
import { DatagridModule } from './../../shared/components/datagrid/datagrid.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from './../../shared/components/form/form.module';
import { ButtonModule } from 'primeng/button';
@NgModule({
  declarations: [
    UsuariosComponent,
    HomeUsuariosComponent,
    CadastroUsuariosComponent,
    CardInformativoComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    CardModule,
    DatagridModule,
    ReactiveFormsModule,
    FormModule,
    ButtonModule
  ]
})
export class UsuariosModule { }
