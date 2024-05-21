import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeConfrontosService } from '../home-confronts.service';
import { animacaoPadrao, animacaoSecundaria, heightAnimation, inOutAnimation, inOutAnimationFast } from 'src/app/core/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-visualizar-confronto',
  templateUrl: './visualizar-confronto.component.html',
  styleUrl: './visualizar-confronto.component.css',
  animations: [animacaoPadrao, inOutAnimation, inOutAnimationFast, heightAnimation, animacaoSecundaria],
})
export class VisualizarConfrontoComponent implements OnInit{
  idConfronto: any;
  dadosConfronto: any;
  mostrarDetalhesAposta: boolean = false;
  apostaAtual: any;
  listaOdds: any;
  formAposta: FormGroup;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private homeConfrontoService: HomeConfrontosService,
    private formBuilder: FormBuilder
  ) {
  }
  ngOnInit() {
    this.idConfronto = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.idConfronto) {
      this.buscarConfronto();
    }

    this.formAposta = this.formBuilder.group({
      vlrOddSelecionada: [null, Validators.required],
      valor: [null, Validators.required],
    })
  }

  buscarConfronto(){
    this.dadosConfronto = this.homeConfrontoService.buscarDados().campeonatos[0].proximos_eventos.filter((item) => item.id == this.idConfronto)
  }

  voltarHome(){
    this.router.navigate(['confrontos'])
  }

  abrirDetalhesAposta(aposta:any){
    this.apostaAtual = aposta;
    this.listaOdds = aposta.odd.map(odd => ({name: `${odd.casa} - ${odd.valor}`, value: odd.valor}));
    this.mostrarDetalhesAposta = true;
  }

  fecharDetalhesAposta() {
    this.apostaAtual = null;
    this.listaOdds = null;
    this.formAposta.reset();
    this.mostrarDetalhesAposta = false;
  }

  enviarAposta(){
    this.formAposta.markAllAsTouched();

    if(this.formAposta.valid){
      console.log(this.formAposta.getRawValue())
    }
  }
}
