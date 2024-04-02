import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-estoque-local',
  standalone: true,
  imports: [],
  templateUrl: './estoque-local.component.html',
  styleUrl: './estoque-local.component.css'
})
export class EstoqueLocalComponent {

  @Input() produto: any

}
