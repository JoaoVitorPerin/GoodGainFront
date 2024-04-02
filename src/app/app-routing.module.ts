import { AppLayoutComponent } from './core/layout/app.layout.component';
import { AutenticacaoComponent } from './core/autenticacao/autenticacao.component';
import { CadastroUsuarioComponent } from './core/cadastro-usuario/cadastro-usuario.component';
import { NaoEncontradaComponent } from './core/nao-encontrada/nao-encontrada.component';
import { PermissaoNegadaComponent } from './core/permissao-negada/permissao-negada.component';
import { AutenticacaoGuard } from './core/guards/autenticacao.guard';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';

const APP_ROUTES: Routes = [
  {
    path: 'login',
    component: AutenticacaoComponent
  },
  {
    path: 'cadastro',
    component: CadastroUsuarioComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AppLayoutComponent,
    data: { animationState: 'AppLayoutComponent' },
    canLoad: [AutenticacaoGuard],
    canActivateChild: [AutenticacaoGuard],
    children: [
      {
        path: '403',
        component: PermissaoNegadaComponent,
      },
      {
        path: '404',
        component: NaoEncontradaComponent,
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: '**',
        redirectTo: 'login'
      }
    ],
  },
  {
    path: '**',
    redirectTo: '',
    data: { animationState: 'FullPath' },
  },
];

export class AppRoutingModule {
  static routing: ModuleWithProviders<RouterModule> =
    RouterModule.forRoot(APP_ROUTES);
}
