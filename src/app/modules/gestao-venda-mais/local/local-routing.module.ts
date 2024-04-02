import { ClienteCadastradoComponent } from './passos/cliente-cadastrado/cliente-cadastrado.component';
import { ClienteCadastrarComponent } from './passos/cliente-cadastrar/cliente-cadastrar.component';
import { ProdutosComponent } from './passos/produtos/produtos.component';
import { RecargaComponent } from './passos/recarga/recarga.component';
import { PagamentoComponent } from './passos/pagamento/pagamento.component';
import { ClienteComponent } from './passos/cliente/cliente.component';
import { LocalComponent } from './local.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: ':tipo',
    component: LocalComponent,
    children: [
      {
        path: 'cliente',
        component: ClienteComponent
      },
      {
        path: 'cliente-cadastrar',
        component: ClienteCadastrarComponent
      },
      {
        path: 'cliente-cadastrado',
        component: ClienteCadastradoComponent
      },
      {
        path: 'produtos',
        component: ProdutosComponent
      },
      {
        path: 'recarga',
        component: RecargaComponent
      },
      {
        path: 'pagamento',
        component: PagamentoComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocalRoutingModule { }
