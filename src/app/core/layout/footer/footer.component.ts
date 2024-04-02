import { Component } from '@angular/core';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  versao: string = environment.VERSAO

}
