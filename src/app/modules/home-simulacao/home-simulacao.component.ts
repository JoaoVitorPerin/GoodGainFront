import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { HomeSimulacaoService } from './home-simulacao.service';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from 'src/app/core/layout/app.layout.service';
import { TokenService } from 'src/app/core/services/token.service';
import { PerfilService } from '../perfil/perfil.service';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { FieldsetModule } from 'primeng/fieldset';
import { AsidebarService } from 'src/app/core/services/asidebar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MeterGroupModule } from 'primeng/metergroup';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { ModalService } from 'src/app/shared/components/modal/modal.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-home-simulacao',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormModule,
    FormsModule,
    CommonModule,
    ButtonModule,
    FieldsetModule,
    MeterGroupModule
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
  todasAsOddsEvento: any;
  oddsEvento: any;

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
  predicoesEvento: any;
  percVitoria: any = [];

  htmlSimulacao: SafeHtml = '';

  @ViewChild('modalResultadoAposta') modalResultadoAposta: any;

  constructor(
    private simulacaoService: HomeSimulacaoService,
    private formBuilder: FormBuilder,
    private layoutService: LayoutService,
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService,
    private perfilService: PerfilService,
    private toastrService: ToastrService,
    private asidebarService: AsidebarService,
    private homeSimulacaoService: HomeSimulacaoService,
    private router: Router,
    private translationService: TranslationService,
    private modalService: ModalService,
    private sanitizer: DomSanitizer
  ) {
    this.eventoId = this.activatedRoute.snapshot.paramMap.get('id');
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
      eventoId: [this.eventoId ?? null]
    });

    if(this.eventoId){
      this.formSimulacao.get('tipoAposta').valueChanges.subscribe(value => {
        const dados = {
          tipo_aposta: value,
          evento: this.eventoId
        }
        this.homeSimulacaoService.buscarOdds(dados).subscribe({
          next: (res) => {
            this.oddsEvento = res.list_odds
              .map(item => ({
                value: item.nome,
                label: item.nome,
                valor_odd: item.valor_odd
              }))
              .sort((a, b) => b.valor_odd - a.valor_odd);
          },
          error: (error) => {
            console.error(error);
            this.formSimulacao.get('odd').setValue(null);
            this.toastrService.mostrarToastrDanger('Odds não disponiveis para esse tipo! Tente novamente mais tarde!');
          }
        });
      });
    }

    this.formSimulacao.get('campeonato').valueChanges.subscribe(value => {
      this.formSimulacao.get('time1').setValue(null);
      this.formSimulacao.get('time2').setValue(null);
      this.dadosTime1 = null;
      this.dadosTime2 = null;
      if (value) {
        this.buscarDadosTimePorCampeonato(value);
      }
    });

    this.formSimulacao.get('odd').valueChanges.subscribe(value => {
      if(this.isAposta){
        this.isAposta = false;
        this.htmlSimulacao = '';
      }
    });

    this.formSimulacao.get('tipoAposta').valueChanges.subscribe(value => {
      if(this.isAposta){
        this.isAposta = false;
        this.htmlSimulacao = '';
      }
    });

    this.formSimulacao.get('time1').valueChanges.subscribe(async value => {
      if (value) {
        this.dadosTime1 = this.timeDisponiveis.find(time => (time.info?.team?.id) === parseInt(value));

        this.dadosTime1 = {
          ...this.dadosTime1,
          cartoes: {
            amarelo: this.sumCards(this.dadosTime1.info.cards.yellow),
            vermelho: this.sumCards(this.dadosTime1.info.cards.red)
          },
          forma: this.refactorFormaTime(this.dadosTime1.info.form)
        }

        this.atualizarItemsTimes();
      } else {
        this.dadosTime1 = null;
        this.atualizarItemsTimes();
      }
    });

    this.formSimulacao.get('time2').valueChanges.subscribe(async value => {
      if (value) {
        this.dadosTime2 = this.timeDisponiveis.find(time => (time.info?.team?.id) === parseInt(value));

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
    
    this.buscarInfosPerfil();
    this.buscarDadosCampeonato();
    this.buscarPreferencias();

    if(this.eventoId){
      this.buscarDadosEvento();
      this.buscarPrevisoesEvento();
    }
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
          odd: typeof this.formSimulacao.get('odd').value === 'string' ? parseFloat(this.formSimulacao.get('odd').value.split(' - ')[0]) : this.formSimulacao.get('odd').value,
          is_aposta: true
        };

        this.simulacaoService.enviarSimulacao(dados).subscribe({
          next: () => {
            this.modalService.fecharModal();
            this.isAposta = false;
            this.formSimulacao.reset({}, { emitEvent: false });
            this.toastrService.mostrarToastrSuccess('Aposta realizada com sucesso!');
            this.asidebarService.triggerHistorico();
            if(this.eventoId){
              this.router.navigate(["/confrontos"])
            }
          },
          error: (error) => {
            console.error(error);
            this.toastrService.mostrarToastrDanger('Erro ao realizar aposta, tente novamente!');
          }
        });
      } else {
        const dados = {
          ...this.formSimulacao.getRawValue(),
          odd: typeof this.formSimulacao.get('odd').value === 'string' ? parseFloat(this.formSimulacao.get('odd').value.split(' - ')[0]) : this.formSimulacao.get('odd').value,
        };
        this.simulacaoService.enviarSimulacao(dados).subscribe({
          next: (res) => {
            this.isAposta = true;
            this.htmlSimulacao = this.sanitizer.bypassSecurityTrustHtml(res.html_retorno);
            this.abrirModalResultadoAposta();
          },
          error: (error) => {
            console.error(error);
            this.toastrService.mostrarToastrDanger('Erro ao realizar aposta, tente novamente!');
          }
        });
      }
    }
  }

  abrirModalResultadoAposta() {
    this.modalService.abrirModal('Resultado da simulação:', this.modalResultadoAposta, [], {larguraDesktop: '50'});
  }

  cancelarSimulacao() {
    this.modalService.fecharModal();
    this.htmlSimulacao = '';
    this.isAposta = false;
  }

  buscarDadosEvento(){
    this.homeSimulacaoService.buscarEvento(this.eventoId).subscribe({
      next: async (res) => {
        await this.buscarDadosTimePorCampeonato(res.campeonato.campeonato_id);
        
        this.formSimulacao.get("campeonato").setValue(res.campeonato.campeonato_id, { emitEvent: false });
        setTimeout(() => {
          this.formSimulacao.get("time1").setValue(res.campeonato.time_a_id);
          this.formSimulacao.get("time2").setValue(res.campeonato.time_b_id);
        }, 1000)
      },
      error: (error) => {
        console.error(error);
        this.toastrService.mostrarToastrDanger('Erro ao buscar evento, tente novamente!');
      }
    });
  }
  
  buscarPrevisoesEvento(){
    this.homeSimulacaoService.buscarPrevisoesEvento(this.eventoId).subscribe({
      next: (res) => {
        this.predicoesEvento = res.predicao;
        if(res.predicao.advice){
          this.translationService.translateText(res.predicao.advice).subscribe(response => {
            res.predicao.advice = response.responseData.translatedText;
          });
        }
        if(res.predicao.percent){
          this.percVitoria = [
            { label: 'Time da casa', color: '#05FF00', value: parseFloat(res.predicao.percent.home.split('%')[0]) },
            { label: 'Empate', color: '#808080', value: parseFloat(res.predicao.percent.draw.split('%')[0]) },
            { label: 'Time de fora', color: '#05FF00', value: parseFloat(res.predicao.percent.away.split('%')[0]) },
          ]
        }
      },
      error: (error) => {
        console.error(error);
        this.toastrService.mostrarToastrDanger('Erro ao buscar previsões do evento, tente novamente!');
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
