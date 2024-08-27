import { Component, OnInit } from '@angular/core';
import { HomeConfrontosService } from './home-confronts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-confrontos',
  templateUrl: './home-confrontos.component.html',
  styleUrl: './home-confrontos.component.css'
})
export class HomeConfrontosComponent implements OnInit{
  dadosConfrontos: any;
  
  constructor(
    private homeConfrontosService: HomeConfrontosService,
    private router: Router
  ) {}

  ngOnInit(){
    this.buscarProximosEventos();
  }

  redirectToEvent(evento:any){
    this.router.navigate([`simulacao/${evento.id}`])
  }

  buscarProximosEventos(){
    this.homeConfrontosService.buscarProximosConfrontos().subscribe(
      (response) => {
        this.dadosConfrontos = response.dados;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
