import { VersoesComponent } from './versoes.component';
import { HomeVersoesComponent } from './home-versoes/home-versoes.component';
import { CadastroVersoesComponent } from './cadastro-versoes/cadastro-versoes.component'; 
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: VersoesComponent,
    children: [
      {
        path: '',
        redirectTo: 'cadastro',
        pathMatch: 'full'
      },
      {
        path: 'cadastro',
        component: CadastroVersoesComponent,
      },
      {
        path: 'cadastro/:id',
        component: CadastroVersoesComponent,
      },
    ]
  }
];

RouterModule.forRoot(routes, { enableTracing: true })

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VersoesRoutingModule { }
