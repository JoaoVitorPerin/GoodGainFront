import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'menus',
        loadChildren: () => 
          import(
            './menus/menus.module'
          ).then(m => m.MenusModule)
      },
      {
        path: 'telas',
        loadChildren: () => 
          import(
            './telas/telas.module'
          ).then(m => m.TelasModule)
      },
      {
        path: 'versoes',
        loadChildren: () => 
          import(
            './versoes/versoes.module'
          ).then(m => m.VersoesModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
