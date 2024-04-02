import { animacaoPadrao } from './core/animations';
import { Router, RouterOutlet, } from '@angular/router';
import { Component, HostListener } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [animacaoPadrao]
})
export class AppComponent {

  title = 'angular-goodgain';

  larguraTela: number

  constructor(private config: PrimeNGConfig,
              private router: Router) {

    this.config.setTranslation({
      accept: 'Accept',
      reject: 'Cancel',
      //translations
      monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      dayNamesMin: ['Dom', 'Seg', 'Ter' , 'Qua', 'Qui', 'Sex', 'Sáb' ],
      dayNamesShort: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    });

    this.larguraTela = window.innerWidth;

    this.setEscala()

  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:keypress', ['$event'])

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.larguraTela = window.innerWidth;
    this.setEscala()
  }

  setEscala(): void {
    let px = 14
    if(this.larguraTela){
      if(this.larguraTela <= 600){
        px = 11
      } else if(this.larguraTela <= 1024){
        px = 13
      } else if(this.larguraTela <= 1360) {
        px = 14
      } else if (this.larguraTela <= 1920){
        px = 18
      } else {
        px = 20
      }
    }
    document.documentElement.style.fontSize = px + 'px';
  }

  prepareRoute(outlet: RouterOutlet): any {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animationState;
  }

}
