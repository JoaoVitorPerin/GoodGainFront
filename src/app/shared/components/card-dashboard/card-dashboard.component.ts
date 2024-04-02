import { toLocaleFixed } from './../../../core/ts/util';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-dashboard',
  templateUrl: './card-dashboard.component.html',
  styleUrl: './card-dashboard.component.css'
})
export class CardDashboardComponent {
  @Input() infosCards: any;

  toLocaleFixed = toLocaleFixed;
}
