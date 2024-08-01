import { UsuariosComponent } from './usuarios.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosCadastroComponent } from './usuarios-cadastro/usuarios-cadastro.component';
import { UsuariosHomeComponent } from './usuarios-home/usuarios-home.component';

const routes: Routes = [
  {
    path: '',
    component: UsuariosComponent,
    children: [
      {
        path: 'home',
        component: UsuariosHomeComponent,
      },
      {
        path: 'cadastro',
        component: UsuariosCadastroComponent,
      },
      {
        path: 'cadastro/:id',
        component: UsuariosCadastroComponent,
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
export class UsuariosRoutingModule { }
