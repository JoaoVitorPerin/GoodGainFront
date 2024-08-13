import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { HomeSimulacaoService } from './home-simulacao.service';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from 'src/app/core/layout/app.layout.service';
import { TokenService } from 'src/app/core/services/token.service';
import { PerfilService } from '../perfil/perfil.service';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { FieldsetModule } from 'primeng/fieldset';
import axios from 'axios';
import { AsidebarService } from 'src/app/core/services/asidebar.service';
import { ActivatedRoute } from '@angular/router';

interface Team {
  strTeam: string;
  strTeamBadge: string;
  strStadium: string;
}

interface ApiResponse {
  teams: Team[];
}

@Component({
  selector: 'app-home-simulacao',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormModule,
    FormsModule,
    CommonModule,
    ButtonModule,
    FieldsetModule
  ],
  templateUrl: './home-simulacao.component.html',
  styleUrls: ['./home-simulacao.component.css']
})
export class HomeSimulacaoComponent implements OnInit {
  cpfUser: any;
  formSimulacao: FormGroup;
  itemsTimes: any;
  itemsCampeonato: any;
  itemsTipoAposta: any;

  timeDisponiveis: any;
  timesParaTime1: any;
  timesParaTime2: any;
  dadosTime1: any;
  dadosTime2: any;
  isMobile = window.innerWidth < 768;
  timeLogo1: string | null = null;
  timeLogo2: string | null = null;
  estadiotimea: string | null = null;
  estadiotimeb: string | null = null;

  isAposta:boolean = false;
  eventoId: string;

  constructor(
    private simulacaoService: HomeSimulacaoService,
    private formBuilder: FormBuilder,
    private layoutService: LayoutService,
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService,
    private perfilService: PerfilService,
    private toastrService: ToastrService,
    private asidebarService: AsidebarService,
    private homeSimulacaoService: HomeSimulacaoService
  ) {
    this.eventoId = this.activatedRoute.snapshot.paramMap.get('id');

    if(this.eventoId){
      this.buscarDadosEvento()
    }
  }

  ngOnInit() {
    window.addEventListener('resize', this.onResize.bind(this));

    this.formSimulacao = this.formBuilder.group({
      cpf_user: [null],
      campeonato: [null, Validators.required],
      time1: [null, Validators.required],
      time2: [null, Validators.required],
      odd: [null, Validators.required],
      valor: [null, Validators.required],
      tipoAposta: [null, Validators.required],
    });

    this.buscarInfosPerfil();
    this.buscarDadosCampeonato();
    this.buscarPreferencias();

    this.formSimulacao.get('campeonato').valueChanges.subscribe(value => {
      this.formSimulacao.get('time1').setValue(null);
      this.formSimulacao.get('time2').setValue(null);
      this.dadosTime1 = null;
      this.dadosTime2 = null;
      if (value) {
        this.buscarDadosTimePorCampeonato(value);
      }
    });

    this.formSimulacao.get('time1').valueChanges.subscribe(async value => {
      if (value) {
        this.dadosTime1 = this.timeDisponiveis.find(time => (time.info?.team?.id) === value);

        this.dadosTime1 = {
          ...this.dadosTime1,
          cartoes: {
            amarelo: this.sumCards(this.dadosTime1.info.cards.yellow),
            vermelho: this.sumCards(this.dadosTime1.info.cards.red)
          },
          forma: this.refactorFormaTime(this.dadosTime1.info.form)
        }
        console.log(this.dadosTime1);

        this.atualizarItemsTimes();
      } else {
        this.dadosTime1 = null;
        this.atualizarItemsTimes();
      }
    });

    this.formSimulacao.get('time2').valueChanges.subscribe(async value => {
      if (value) {
        this.dadosTime2 = this.timeDisponiveis.find(time => (time.info?.team?.id) === value);

        this.dadosTime2 = {
          ...this.dadosTime2,
          cartoes: {
            amarelo: this.sumCards(this.dadosTime2.info.cards.yellow),
            vermelho: this.sumCards(this.dadosTime2.info.cards.red),
          },
          forma: this.refactorFormaTime(this.dadosTime2.info.form)
        }
        this.atualizarItemsTimes();
      } else {
        this.dadosTime2 = null;
        this.atualizarItemsTimes();
      }
    });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  buscarDadosCampeonato() {
    this.simulacaoService.buscarCampeonato().subscribe({
      next: (dados) => {
        this.itemsCampeonato = dados.campeonatos?.map(item => ({
          value: item.id,
          label: item.nome
        }));
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  buscarPreferencias(){
    this.perfilService.buscarPreferencias(this.cpfUser).subscribe({
      next: (dados) => {
        this.itemsTipoAposta = dados.dados.opcoes_apostas?.map(item => ({
          value: item.id,
          label: item.informacao
        }));
      }, error: () => {
        this.toastrService.mostrarToastrDanger('Nao foi possivel buscar as preferencias, contate o suporte!')
      }
    });
  }

  buscarInfosPerfil(){
    this.cpfUser = this.tokenService.getJwtDecodedAccess().cli_info.cli_info.cpf;
    this.formSimulacao.get('cpf_user').setValue(this.cpfUser);
  }

  buscarDadosTimePorCampeonato(campeonatoId: string) {
    this.simulacaoService.buscarTimePorCampeonato(campeonatoId).subscribe({
      next: (dados) => {
        this.timeDisponiveis = dados.times;
        this.atualizarItemsTimes();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  atualizarItemsTimes() {
    const time1Id = this.formSimulacao.get('time1').value;
    const time2Id = this.formSimulacao.get('time2').value;

    this.timesParaTime1 = this.timeDisponiveis
      .filter(time => (time.info?.team.id) !== time2Id)
      .map(item => ({
        value: item.info?.team?.id,
        label: item.info?.team?.name
      }));

    this.timesParaTime2 = this.timeDisponiveis
      .filter(time => (time.info?.team.id) !== time1Id)
      .map(item => ({
        value: item.info?.team?.id,
        label: item.info?.team?.name
      }));
  }

  enviarSimulacao(apostar?: boolean) {
    this.formSimulacao.markAllAsTouched();

    if (this.formSimulacao.valid) {
      if (apostar) {
        const dados = {
          ...this.formSimulacao.getRawValue(),
          is_aposta: true
        };

        this.simulacaoService.enviarSimulacao(dados).subscribe({
          next: () => {
            this.isAposta = false;
            this.formSimulacao.reset();
            this.toastrService.mostrarToastrSuccess('Aposta realizada com sucesso!');
            this.asidebarService.triggerHistorico();
          },
          error: (error) => {
            console.error(error);
            this.toastrService.mostrarToastrDanger('Erro ao realizar aposta, tente novamente!');
          }
        });
      } else {
        this.simulacaoService.enviarSimulacao(this.formSimulacao.getRawValue()).subscribe({
          next: (res) => {
            this.isAposta = true;
            if (res.descricao_resultado == 'Não recomendado') {
              this.toastrService.mostrarToastrDanger(`Essa aposta é NÃO RECOMENDADA! Pois a probabilidade de ganho é baixa!`);
            } else {
              this.toastrService.mostrarToastrSuccess(`Essa aposta é RECOMENDADA! Pois a probabilidade de ganho é alta!`);
            }
          },
          error: (error) => {
            console.error(error);
            this.toastrService.mostrarToastrDanger('Erro ao realizar aposta, tente novamente!');
          }
        });
      }
    }
  }

  cancelarSimulacao() {
    this.isAposta = false;
  }

  buscarDadosEvento(){
    this.homeSimulacaoService.buscarEvento(this.eventoId).subscribe({
      next: (res) => {
        console.log(res)
      },
      error: (error) => {
        console.error(error);
        this.toastrService.mostrarToastrDanger('Erro ao buscar evento, tente novamente!');
      }
    });
  }

  sumCards(value){
    const valor = Object.values(value).reduce((sum: number, val: any) => sum + (typeof val.total === 'number' ? val.total : 0), 0);
    return valor;
  }

  refactorFormaTime(value: string): string[] {
    const lastFiveChars = value.slice(-5);
    const resultArray = lastFiveChars.split('');
    
    return resultArray;
  }

  onResize() {
    this.isMobile = window.innerWidth < 768;
  }
}
