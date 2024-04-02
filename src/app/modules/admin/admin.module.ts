import { DatagridModule } from './../../shared/components/datagrid/datagrid.module';
import { MenusComponent } from './menus/menus.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MenusModule } from './menus/menus.module';
import { TelasComponent } from './telas/telas.component';
import { TelasModule } from './telas/telas.module';
import { VersoesModule } from './versoes/versoes.module';
import { VersoesComponent } from './versoes/versoes.component';

@NgModule({
  declarations: [
    MenusComponent,
    TelasComponent,
    VersoesComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    DatagridModule,
    FormModule,
    MenusModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TelasModule,
    VersoesModule
  ]
})
export class AdminModule { }
