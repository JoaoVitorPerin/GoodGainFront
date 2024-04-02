import { Component, Input } from '@angular/core';
import { MenuItem } from "primeng/api";
import { StepsModule } from 'primeng/steps';

@Component({
  selector: 'app-steps',
  standalone: true,
  imports: [
    StepsModule
  ],
  templateUrl: './steps.component.html',
  styleUrl: './steps.component.css'
})
export class StepsComponent {

  @Input({required: true}) steps: MenuItem[] | []
  @Input() readonly: boolean;

  activeIndex: number;

  constructor(){}

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }

}
