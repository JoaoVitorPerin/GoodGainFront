import { CardConfrontosComponent } from './card-confrontos/card-confrontos.component';
import { HomeConfrontosComponent } from './home-confrontos.component';
// Angular
import { NgModule } from '@angular/core';

//Módulos

@NgModule({
  declarations: [
    HomeConfrontosComponent
  ],
  imports: [
    CardConfrontosComponent
  ],
  providers: [
    HomeConfrontosComponent
  ],
})
export class HomeConfrontosModule {
}