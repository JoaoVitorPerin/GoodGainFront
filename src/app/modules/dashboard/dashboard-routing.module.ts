import { DashboardComponent } from './dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendasComponent } from './vendas/vendas.component';
import { InformacoesComponent } from './informacoes/informacoes.component';
import { ChecklistComponent } from './checklist/checklist.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'vendas',
        component: VendasComponent,
      },
      {
        path: 'informacoes',
        component: InformacoesComponent
      },
      {
        path: 'checklist',
        component: ChecklistComponent
      },
      {
        path: '',
        redirectTo: 'vendas',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
