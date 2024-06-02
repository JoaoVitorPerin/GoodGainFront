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

@Component({
  selector: 'app-home-simulacao',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormModule,
    FormsModule,
    CommonModule,
    ButtonModule
  ],
  templateUrl: './home-simulacao.component.html',
  styleUrl: './home-simulacao.component.css'
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
  isMobile = this.layoutService.isMobile();

  constructor(
    private simulacaoService: HomeSimulacaoService,
    private formBuilder: FormBuilder,
    private layoutService: LayoutService,
    private tokenService: TokenService,
    private perfilService: PerfilService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
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
      if (value) {
        this.buscarDadosTimePorCampeonato(value);
      }
    });

    this.formSimulacao.get('time1').valueChanges.subscribe(value => {
      if (value) {
        this.dadosTime1 = this.timeDisponiveis.find(time => time.info.competitor.id === value);
        this.atualizarItemsTimes();
      } else {
        this.dadosTime1 = null;
        this.atualizarItemsTimes();
      }
    });

    this.formSimulacao.get('time2').valueChanges.subscribe(value => {
      if (value) {
        this.dadosTime2 = this.timeDisponiveis.find(time => time.info.competitor.id === value);
        this.atualizarItemsTimes();
      } else {
        this.dadosTime2 = null;
        this.atualizarItemsTimes();
      }
    });
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
    })
  }

  buscarInfosPerfil(){
    this.cpfUser = this.tokenService.getJwtDecoded().cli_info.cpf;
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
      .filter(time => time.info.competitor.id !== time2Id)
      .map(item => ({
        value: item.info.competitor.id,
        label: item.info.competitor.name
      }));

    this.timesParaTime2 = this.timeDisponiveis
      .filter(time => time.info.competitor.id !== time1Id)
      .map(item => ({
        value: item.info.competitor.id,
        label: item.info.competitor.name
      }));
  }

  enviarAposta() {
    this.formSimulacao.markAllAsTouched();

    if (this.formSimulacao.valid) {
      this.simulacaoService.enviarSimulacao(this.formSimulacao.getRawValue()).subscribe({
        next: () => {
          this.formSimulacao.reset();
          this.toastrService.mostrarToastrSuccess('Aposta realizada com sucesso!');
        },
        error: (error) => {
          console.error(error);
          this.toastrService.mostrarToastrDanger('Erro ao realizar aposta, tente novamente!');
        }
      });
    }
  }
}
