import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TokenService } from 'src/app/core/services/token.service';
import { DashboardService } from './dashboard.service';
import { toLocaleFixed } from 'src/app/core/ts/util';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ChartModule,
    NgxEchartsDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    provideEcharts(),
  ]
})
export class DashboardComponent implements OnInit{
  nomeUser: any;
  cpfUser: any;

  dataCampeonatos: any;
  basicOptions: any;
  tipoAposta: any;

  dadosCards: any;
  chartCampeonatoOption: EChartsOption;
  chartTipoOption: EChartsOption;
  toLocaleFixed = toLocaleFixed;

  constructor(
    private tokenService: TokenService,
    private dashboardService: DashboardService
  ){}

  ngOnInit() {
      this.buscarInfosPerfil();
      this.buscarDadosDashboard();

      this.chartCampeonatoOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'cross',
              crossStyle: {
                  color: '#999'
              }
          }
        },
        xAxis: [{
          type: 'category',
          data: [],
        }],
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [],
            type: 'bar',
            color: '#05FF00',
          },
        ],
      };

      this.chartTipoOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'cross',
              crossStyle: {
                  color: '#999'
              }
          }
        },
        xAxis: [{
          type: 'category',
          data: [],
        }],
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [],
            type: 'bar',
            color: '#05FF00',
          },
        ],
      };
  }

  buscarInfosPerfil(){
    this.nomeUser = `${this.tokenService.getJwtDecoded().cli_info.nome} ${this.tokenService.getJwtDecoded().cli_info.sobrenome}`;
    this.cpfUser = this.tokenService.getJwtDecoded().cli_info.cpf;
  }

  buscarDadosDashboard(){

    this.dashboardService.buscarDados(this.cpfUser).subscribe({
      next: (res) => {
        this.dadosCards = {
          odd_media: res.dados.media_odds,
          qtd_apostas: res.dados.qtd_apostas,
          valor_medio: res.dados.valor_apostado,
          tipoAposta: this.returnTipoAposta(res.dados.tipo_aposta_mais_escolhida, res.tipos)
        };

        this.chartCampeonatoOption.xAxis[0].data = res.dados.grafico_campeonatos.map((item: any) => this.returnCampeonato(item.campeonato, res.campeonatos));

        this.chartCampeonatoOption.series[0].data = res.dados.grafico_campeonatos.map((item: any) => item.valor);

        this.chartTipoOption.xAxis[0].data = res.dados.grafico_tipo_aposta.map((item: any) => this.returnTipoAposta(item.tipo_aposta, res.tipos));

        this.chartTipoOption.series[0].data = res.dados.grafico_tipo_aposta.map((item: any) => item.valor);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  returnTipoAposta(tipo: string, listaTipo: any){
    const tipoAposta = listaTipo.find((item: any) => item.id === parseInt(tipo));
    return tipoAposta.informacao;
  }

  returnCampeonato(campeonato: any, listaCampeonato: any){
    console.log(campeonato, listaCampeonato);
    const nomeCampeonato = listaCampeonato.find((item: any) => item.id === campeonato);
    console.log(nomeCampeonato);
    return nomeCampeonato.nome;
  }
}
