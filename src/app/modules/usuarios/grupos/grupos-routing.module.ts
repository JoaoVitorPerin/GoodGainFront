import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeGruposComponent } from './home-grupos/home-grupos.component';
import { CadastroGruposComponent } from './cadastro-grupos/cadastro-grupos.component';
import { GruposComponent } from './grupos.component';

const routes: Routes = [
  {
    path: '',
    component: GruposComponent,
    children: [
      {
        path: 'home',
        component: HomeGruposComponent,
      },
      {
        path: 'cadastro',
        component: CadastroGruposComponent
      },
      {
        path: 'cadastro/:id',
        component: CadastroGruposComponent
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
export class GruposRoutingModule { }
