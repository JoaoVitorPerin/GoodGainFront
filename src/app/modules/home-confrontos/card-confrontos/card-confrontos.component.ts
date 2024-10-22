import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-card-confrontos',
  standalone: true,
  imports: [
    CommonModule,
    CardModule
  ],
  templateUrl: './card-confrontos.component.html',
  styleUrl: './card-confrontos.component.css'
})

export class CardConfrontosComponent {
  @Input({required: true}) dados: any;
  @Input({required: true}) nome: any;

  constructor(
    private router: Router
  ){
  }

  redirectToEvent(evento:any){
    this.router.navigate([`simulacao/${evento.id}`])
  }
}
