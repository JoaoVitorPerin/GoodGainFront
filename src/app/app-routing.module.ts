import { AppLayoutComponent } from './core/layout/app.layout.component';
import { AutenticacaoComponent } from './core/autenticacao/autenticacao.component';
import { CadastroUsuarioComponent } from './core/cadastro-usuario/cadastro-usuario.component';
import { NaoEncontradaComponent } from './core/nao-encontrada/nao-encontrada.component';
import { PermissaoNegadaComponent } from './core/permissao-negada/permissao-negada.component';
import { AutenticacaoGuard } from './core/guards/autenticacao.guard';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent as HomeInicial } from './core/home/home.component';
import { LoginRedirectGuard } from './core/guards/loginRedirect.guard';
import { LogoutGuard } from './core/guards/logout.guard';
import { PerfilComponent } from './modules/perfil/perfil.component';
import { HomeConfrontosComponent } from './modules/home-confrontos/home-confrontos.component';
import { VisualizarConfrontoComponent } from './modules/home-confrontos/visualizar-confronto/visualizar-confronto.component';
import { HomeSimulacaoComponent } from './modules/home-simulacao/home-simulacao.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { LogIntegracaoComponent } from './modules/log-integracao/log-integracao.component';

const APP_ROUTES: Routes = [
  {
    path: 'login',
    component: AutenticacaoComponent
  },
  {
    path: 'logout',
    canActivate: [LogoutGuard],
    children: []
  },
  {
    path: 'cadastro',
    component: CadastroUsuarioComponent
  },
  {
    path: 'home',
    component: HomeInicial
  },
  {
    path: '',
    canActivate: [LoginRedirectGuard],
    children: []
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
        path: 'simulacao',
        component: HomeSimulacaoComponent
      },
      {
        path: 'confrontos',
        component: HomeConfrontosComponent
      },
      {
        path: 'confrontos/:id',
        component: VisualizarConfrontoComponent
      },
      {
        path: 'log-api',
        component: LogIntegracaoComponent
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import(
            './modules/usuarios/usuarios.module'
          ).then(m => m.UsuariosModule)
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'wiki',
        loadChildren: () => 
          import(
            './modules/wiki/wiki.module'
          ).then(m => m.WikiModule)
      },
      {
        path: 'perfil',
        component: PerfilComponent
      },
      {
        path: '**',
        redirectTo: '404'
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
    data: { animationState: 'FullPath' },
  },
];

export class AppRoutingModule {
  static routing: ModuleWithProviders<RouterModule> =
    RouterModule.forRoot(APP_ROUTES);
}
