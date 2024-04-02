import { animacaoPadrao, inOutAnimation } from 'src/app/core/animations';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-gestao-arquivos',
  templateUrl: './gestao-arquivos.component.html',
  styleUrls: ['./gestao-arquivos.component.css'],
  animations: [animacaoPadrao, inOutAnimation]
})
export class GestaoArquivosComponent {

  urlHome: { url: string[] };

  constructor() {
    this.urlHome = {
      url: ['arquivos', 'home']
    };
  }

  prepareRoute(outlet: RouterOutlet): any {
    return outlet &&
       outlet.activatedRouteData &&
       outlet.activatedRouteData.animationState;
 }
}
