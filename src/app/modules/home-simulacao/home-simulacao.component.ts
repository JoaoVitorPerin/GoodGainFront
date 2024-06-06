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
  isMobile = this.layoutService.isMobile();
  timeLogo1: string | null = null;
  timeLogo2: string | null = null;
  estadiotimea: string | null = null;
  estadiotimeb: string | null = null;

  isAposta:boolean = false;

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

    this.formSimulacao.get('time1').valueChanges.subscribe(async value => {
      if (value) {
        console.log(this.timeDisponiveis)
        this.dadosTime1 = this.timeDisponiveis.find(time => time.info?.competitor?.id ?? time.info.id === value);
        this.atualizarItemsTimes();
        const splitName = this.dadosTime1.info?.competitor?.name.split(' ') ?? this.dadosTime1.info.name.split(' ');
        const longestName = splitName.reduce((longest, currentWord) => currentWord.length > longest.length ? currentWord : longest, '');
        const timeInfo = await this.buscarLogoDoTime(longestName);
        if (timeInfo) {
          this.timeLogo1 = timeInfo.logo;
          this.estadiotimea = timeInfo.stadium;
        }
      } else {
        this.dadosTime1 = null;
        this.timeLogo1 = null;
        this.estadiotimea = null;
        this.atualizarItemsTimes();
      }
    });

    this.formSimulacao.get('time2').valueChanges.subscribe(async value => {
      if (value) {
        this.dadosTime2 = this.timeDisponiveis.find(time => time.info?.competitor?.id ?? time.info.id === value);
        const splitName = this.dadosTime2.info?.competitor?.name.split(' ') ?? this.dadosTime2.info.name.split(' ');
        const longestName = splitName.reduce((longest, currentWord) => currentWord.length > longest.length ? currentWord : longest, '');
        const timeInfo = await this.buscarLogoDoTime(longestName);
        if (timeInfo) {
          this.timeLogo2 = timeInfo.logo;
          this.estadiotimeb = timeInfo.stadium;
        }
      } else {
        this.dadosTime2 = null;
        this.timeLogo2 = null;
        this.estadiotimeb = null;
      }
    });
  }

  async buscarLogoDoTime(teamName: string): Promise<{ logo: string | null, stadium: string | null }> {
    const apiKey = '3'; // Substitua pela sua chave de API do TheSportsDB
    const url = `https://www.thesportsdb.com/api/v1/json/${apiKey}/searchteams.php?t=${encodeURIComponent(teamName)}`;

    try {
      const response = await axios.get<ApiResponse>(url);
      const data = response.data;

      if (data.teams && data.teams.length > 0) {
        const team = data.teams[0];
        return { logo: team.strTeamBadge, stadium: team.strStadium };
      } else {
        return { logo: null, stadium: null };
      }
    } catch (error) {
      console.error('Error fetching team logo and stadium:', error);
      return { logo: null, stadium: null };
    }
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
      .filter(time => time.info?.competitor?.id ?? time.info.id !== time2Id)
      .map(item => ({
        value: item.info.competitor?.id ?? item.info.id,
        label: item.info.competitor?.name ?? item.info.name
      }));

    this.timesParaTime2 = this.timeDisponiveis
      .filter(time => time.info?.competitor?.id ?? time.info.id !== time1Id)
      .map(item => ({
        value: item.info.competitor?.id ?? item.info.id,
        label: item.info.competitor?.name ?? item.info.name
      }));
  }

  enviarSimulacao(apostar?: boolean) {
    this.formSimulacao.markAllAsTouched();

    if (this.formSimulacao.valid) {
      if(apostar){
        const dados = {
          ...this.formSimulacao.getRawValue(),
          is_aposta: true
        }

        this.simulacaoService.enviarSimulacao(dados).subscribe({
          next: () => {
              this.isAposta = false;
              this.formSimulacao.reset();
              this.toastrService.mostrarToastrSuccess('Aposta realizada com sucesso!');
          },
          error: (error) => {
            console.error(error);
            this.toastrService.mostrarToastrDanger('Erro ao realizar aposta, tente novamente!');
          }
        });
      } else{
        this.simulacaoService.enviarSimulacao(this.formSimulacao.getRawValue()).subscribe({
          next: (res) => {
            console.log(this.isAposta)
            this.isAposta = true;
            if(res.descricao_resultado == 'Não recomendada'){
              this.toastrService.mostrarToastrDanger(`Essa aposta é ${res.descricao_resultado}!`);
            } else{
              this.toastrService.mostrarToastrSuccess(`Essa aposta é ${res.descricao_resultado}!`);
            }
            console.log(this.isAposta)
          },
          error: (error) => {
            console.error(error);
            this.toastrService.mostrarToastrDanger('Erro ao realizar aposta, tente novamente!');
          }
        });

        console.log(this.isAposta)
      }
      
    }
  }
  
  cancelarSimulacao(){
    this.isAposta = false;
  }
}
