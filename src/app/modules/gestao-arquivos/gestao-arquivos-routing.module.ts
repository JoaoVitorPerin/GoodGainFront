
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { GestaoArquivosComponent } from './gestao-arquivos.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: GestaoArquivosComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        data: { animationState: 'HomeComponent' },
      },
      {
        path: '**',
        redirectTo: 'home',
      },
    ],
  },
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestaoArquivosRoutingModule { }
