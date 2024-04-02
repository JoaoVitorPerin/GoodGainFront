import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGestaoArquivosComponent } from './admin-gestao-arquivos.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { CadastroAdminComponent } from './cadastro-admin/cadastro-admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminGestaoArquivosComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeAdminComponent,
      },
      {
        path: 'cadastro',
        component: CadastroAdminComponent,
      },
      {
        path: 'cadastro/:id',
        component: CadastroAdminComponent,
      },
    ]
  }
];

RouterModule.forRoot(routes, { enableTracing: true })

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
