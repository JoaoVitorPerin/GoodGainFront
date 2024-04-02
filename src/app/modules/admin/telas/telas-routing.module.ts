import { CadastroTelasComponent } from './cadastro-telas/cadastro-telas.component';
import { HomeTelasComponent } from './home-telas/home-telas.component';
import { TelasComponent } from './telas.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: TelasComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeTelasComponent,
      },
      {
        path: 'cadastro',
        component: CadastroTelasComponent,
      },
      {
        path: 'cadastro/:id',
        component: CadastroTelasComponent,
      },
    ]
  }
];

RouterModule.forRoot(routes, { enableTracing: true })

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TelasRoutingModule { }
