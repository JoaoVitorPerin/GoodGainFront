import { MenusComponent } from './menus.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeMenusComponent } from './home-menus/home-menus.component';
import { CadastroMenusComponent } from './cadastro-menus/cadastro-menus.component';

const routes: Routes = [
  {
    path: '',
    component: MenusComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeMenusComponent,
      },
      {
        path: 'cadastro',
        component: CadastroMenusComponent,
      },
      {
        path: 'cadastro/:id',
        component: CadastroMenusComponent,
      },
    ]
  }
];

RouterModule.forRoot(routes, { enableTracing: true })

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenusRoutingModule { }
