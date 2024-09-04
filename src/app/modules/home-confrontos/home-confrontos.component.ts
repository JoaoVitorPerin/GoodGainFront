import { Component, OnInit } from '@angular/core';
import { HomeConfrontosService } from './home-confronts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-confrontos',
  templateUrl: './home-confrontos.component.html',
  styleUrl: './home-confrontos.component.css'
})
export class HomeConfrontosComponent{
  dadosConfrontos: any;
  preferencia: boolean = false;
  
  constructor(
    private homeConfrontosService: HomeConfrontosService,
    private router: Router
  ) {
    if(JSON.parse(localStorage.getItem("visualizacao"))?.valor){
      this.preferencia = JSON.parse(localStorage.getItem("visualizacao")).valor
      this.buscarProximosEventosPreferencias();
    }else{
      this.buscarProximosEventos();
    }
  }

  redirectToEvent(evento:any){
    this.router.navigate([`simulacao/${evento.id}`])
  }

  buscarProximosEventos(){
    this.homeConfrontosService.buscarProximosConfrontos().subscribe(
      (response) => {
        this.preferencia = false;
        localStorage.setItem("visualizacao", JSON.stringify({valor: false}))
        this.dadosConfrontos = response.dados;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  buscarProximosEventosPreferencias(){
    this.homeConfrontosService.buscarProximosConfrontosByUserPreference().subscribe(
      (response) => {
        this.preferencia = true;
        localStorage.setItem("visualizacao", JSON.stringify({valor: true}))
        this.dadosConfrontos = response.dados;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
