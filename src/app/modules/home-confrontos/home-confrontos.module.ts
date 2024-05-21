import { CardConfrontosComponent } from './card-confrontos/card-confrontos.component';
import { HomeConfrontosComponent } from './home-confrontos.component';
// Angular
import { NgModule } from '@angular/core';
import { VisualizarConfrontoComponent } from './visualizar-confronto/visualizar-confronto.component';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeConfrontosComponent,
    VisualizarConfrontoComponent
  ],
  imports: [
    CardConfrontosComponent,
    CardModule,
    SelectButtonModule,
    FormModule,
    ButtonModule,
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    HomeConfrontosComponent
  ],
})
export class HomeConfrontosModule {
}