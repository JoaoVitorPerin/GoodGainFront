import { Component, OnInit } from '@angular/core';
import { HomeConfrontosService } from './home-confronts.service';

@Component({
  selector: 'app-home-confrontos',
  templateUrl: './home-confrontos.component.html',
  styleUrl: './home-confrontos.component.css'
})
export class HomeConfrontosComponent implements OnInit{
  dadosConfrontos: any;
  
  constructor(
    private homeConfrontosService: HomeConfrontosService
  ) {}

  ngOnInit(){
    this.buscarProximosEventos();
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
