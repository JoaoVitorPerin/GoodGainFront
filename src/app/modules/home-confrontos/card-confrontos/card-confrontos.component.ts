import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import axios from 'axios';

interface Team {
  strTeam: string;
  strTeamBadge: string;
  strStadium: string;
}

interface ApiResponse {
  teams: Team[];
}

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

  constructor(
    private router: Router
  ){
  }

  redirectToEvent(evento:any){
    this.router.navigate([`simulacao/${evento.id}`])
  }
}
