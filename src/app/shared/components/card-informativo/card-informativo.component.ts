import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-informativo',
  templateUrl: './card-informativo.component.html',
  styleUrl: './card-informativo.component.css'
})
export class CardInformativoComponent {
  @Input() infosCards: any;

  constructor(private router: Router){
  }

  redirectTo(url: string): void {
    this.router.navigate([url])
  }
}
