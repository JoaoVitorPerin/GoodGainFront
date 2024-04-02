import { GestaoVendaMaisComponent } from './gestao-venda-mais.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: GestaoVendaMaisComponent,
    children: [
      {
        path: 'local',
        loadChildren: () =>
          import(
            './local/local.module'
          ).then((m) => m.LocalModule),
        data: { animationState: 'Local' },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestaoVendaMaisRoutingModule { }
