import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-card-confrontos',
  standalone: true,
  imports: [
    CardModule
  ],
  templateUrl: './card-confrontos.component.html',
  styleUrl: './card-confrontos.component.css'
})
export class CardConfrontosComponent {
  constructor(
    private router: Router
  ){
  }
  @Input({required: true}) dados: any

  redirectToEvent(evento:any){
    this.router.navigate([`confrontos/${evento.id}`])
  }
}
