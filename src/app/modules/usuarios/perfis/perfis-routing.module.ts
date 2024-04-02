import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePerfisComponent } from './home-perfis/home-perfis.component';
import { PerfisComponent } from './perfis.component';
import { CadastroPerfisComponent } from './cadastro-perfis/cadastro-perfis.component';

const routes: Routes = [
  {
    path: '',
    component: PerfisComponent,
    children: [
      {
        path: 'home',
        component: HomePerfisComponent,
      },
      {
        path: 'cadastro',
        component: CadastroPerfisComponent
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfisRoutingModule { }
