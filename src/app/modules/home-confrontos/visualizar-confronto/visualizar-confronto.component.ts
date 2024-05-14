import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeConfrontosService } from '../home-confronts.service';

@Component({
  selector: 'app-visualizar-confronto',
  templateUrl: './visualizar-confronto.component.html',
  styleUrl: './visualizar-confronto.component.css'
})
export class VisualizarConfrontoComponent implements OnInit{
  idConfronto: any;
  dadosConfronto: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private homeConfrontoService: HomeConfrontosService
  ) {
  }
  ngOnInit() {
    this.idConfronto = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.idConfronto) {
      this.buscarConfronto();
    }
  }

  buscarConfronto(){
    this.dadosConfronto = this.homeConfrontoService.buscarDados().campeonatos[0].proximos_eventos.filter((item) => item.id == this.idConfronto)

    console.log(this.dadosConfronto)
  }
}
