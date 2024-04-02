import { VendasComponent } from './vendas/vendas.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CabecalhoFilialComponent } from 'src/app/shared/components/cabecalho-filial/cabecalho-filial.component';
import { CardModule } from 'primeng/card';
import { CardDashboardComponent } from 'src/app/shared/components/card-dashboard/card-dashboard.component';
import { DividerModule } from 'primeng/divider';
import { GestorArquivosModule } from 'src/app/shared/components/gestor-arquivos/gestor-arquivos.module';

@NgModule({
  declarations: [
    VendasComponent,
    CabecalhoFilialComponent,
    CardDashboardComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CardModule,
    DividerModule,
    GestorArquivosModule
  ]
})
export class DashboardModule { }
