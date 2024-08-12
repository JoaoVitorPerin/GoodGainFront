import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutenticacaoComponent } from './core/autenticacao/autenticacao.component';
import { LogoutGuard } from './core/guards/logout.guard';
import { CadastroUsuarioComponent } from './core/cadastro-usuario/cadastro-usuario.component';
import { HomeComponent } from './core/home/home.component';
import { LoginRedirectGuard } from './core/guards/loginRedirect.guard';
import { AppLayoutComponent } from './core/layout/app.layout.component';
import { AutenticacaoGuard } from './core/guards/autenticacao.guard';
import { PermissaoNegadaComponent } from './core/permissao-negada/permissao-negada.component';
import { NaoEncontradaComponent } from './core/nao-encontrada/nao-encontrada.component';
import { PermissaoGuard } from './core/guards/permissao.guard';
import { HomeSimulacaoComponent } from './modules/home-simulacao/home-simulacao.component';
import { HomeConfrontosComponent } from './modules/home-confrontos/home-confrontos.component';
import { VisualizarConfrontoComponent } from './modules/home-confrontos/visualizar-confronto/visualizar-confronto.component';
import { LogIntegracaoComponent } from './modules/log-integracao/log-integracao.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { PerfilComponent } from './modules/perfil/perfil.component';
import { PlanoUsuarioComponent } from './core/plano-usuario/plano-usuario.component';

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
    path: 'plano/:id',
    component: PlanoUsuarioComponent
  },
  {
    path: 'home',
    component: HomeComponent
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
        canActivate: [PermissaoGuard],
        data: { perfil_id: ['gratuito', 'premium', 'Vip', 'admin'] },
        component: HomeSimulacaoComponent,
      },
      {
        path: 'simulacao/:id',
        canActivate: [PermissaoGuard],
        data: { perfil_id: ['gratuito', 'premium', 'Vip', 'admin'] },
        component: HomeSimulacaoComponent,
      },
      {
        path: 'confrontos',
        canActivate: [PermissaoGuard],
        data: { perfil_id: ['premium', 'Vip', 'admin'] },
        component: HomeConfrontosComponent,
      },
      {
        path: 'confrontos/:id',
        canActivate: [PermissaoGuard],
        data: { perfil_id: ['premium', 'Vip', 'admin'] },
        component: VisualizarConfrontoComponent,
      },
      {
        path: 'log-api',
        canActivate: [PermissaoGuard],
        data: { perfil_id: ['admin'] },
        component: LogIntegracaoComponent,
      },
      {
        path: 'usuarios',
        canActivateChild: [PermissaoGuard],
        data: { perfil_id: ['admin'] },
        loadChildren: () =>
          import(
            './modules/usuarios/usuarios.module'
          ).then(m => m.UsuariosModule)
      },
      {
        path: 'dashboard',
        canActivate: [PermissaoGuard],
        data: { perfil_id: ['Vip', 'admin'] },
        component: DashboardComponent,
      },
      {
        path: 'wiki',
        canActivate: [PermissaoGuard],
        data: { perfil_id: ['admin'] },
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
