import { UsuariosComponent } from './usuarios.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroUsuariosComponent } from './cadastro-usuarios/cadastro-usuarios.component';
import { HomeUsuariosComponent } from './home-usuarios/home-usuarios.component';

const routes: Routes = [
  {
    path: '',
    component: UsuariosComponent,
    children: [
      {
        path: 'home',
        component: HomeUsuariosComponent,
      },
      {
        path: 'cadastro',
        component: CadastroUsuariosComponent
      },
      {
        path: 'cadastro/:id',
        component: CadastroUsuariosComponent
      },
      {
        path: 'grupos',
        loadChildren: () => 
          import(
            './grupos/grupos.module'
          ).then(m => m.GruposModule)
      },
      {
        path: 'perfis',
        loadChildren: () => 
          import(
            './perfis/perfis.module'
          ).then(m => m.PerfisModule)
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
