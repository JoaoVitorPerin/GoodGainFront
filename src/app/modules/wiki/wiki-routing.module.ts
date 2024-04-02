import { WikiComponent } from './wiki.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsComponent } from './forms/forms.component';

const routes: Routes = [
  {
    path: '',
    component: WikiComponent,
    children: [
      {
        path: 'forms',
        component: FormsComponent,
      },
      {
        path: '',
        redirectTo: 'forms',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WikiRoutingModule { }
