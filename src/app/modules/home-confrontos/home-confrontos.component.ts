import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeConfrontosService } from './home-confronts.service';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/shared/components/modal/modal.service';

@Component({
  selector: 'app-home-confrontos',
  templateUrl: './home-confrontos.component.html',
  styleUrl: './home-confrontos.component.css'
})
export class HomeConfrontosComponent{
  dadosConfrontos: any;
  preferencia: boolean = false;
  classificacao: any;
  isMobile = window.innerWidth < 768;

  @ViewChild('modalClassificacao') modalClassificacao: any;
  
  constructor(
    private homeConfrontosService: HomeConfrontosService,
    private router: Router,
    private modalService: ModalService
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

  abrirModalClassificacao(dados: any){
    console.log(dados)
    this.classificacao = dados;
    this.classificacao = this.classificacao.map((item: any) => {
      return {
        ...item,
        forma: this.refactorFormaTime(item.forma)
      }
    })
    console.log(this.classificacao)
    this.modalService.abrirModal('Classificação:', this.modalClassificacao, [], {larguraDesktop: '50'});
  }

  refactorFormaTime(value: string): string[] {
    const lastFiveChars = value.slice(-5);
    const resultArray = lastFiveChars.split('');
    
    return resultArray.reverse();
  }
}
