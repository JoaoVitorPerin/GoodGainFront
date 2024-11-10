import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TokenService } from 'src/app/core/services/token.service';
import { DashboardService } from './dashboard.service';
import { toLocaleFixed } from 'src/app/core/ts/util';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { ButtonModule } from 'primeng/button';
import { DatagridPrimeConfig, datagridPrimeConfigDefault } from 'src/app/core/ts/datagridPrimeConfigDefault';
import { DatagridPrimeModule } from 'src/app/shared/components/datagrid-prime/datagrid-prime.module';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ChartModule,
    NgxEchartsDirective,
    ButtonModule,
    DatagridPrimeModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    provideEcharts(),
  ]
})
export class DashboardComponent implements OnInit {
  @ViewChild('chartCampeonato', { static: false }) chartCampeonatoElement: ElementRef;
  @ViewChild('chartTipo', { static: false }) chartTipoElement: ElementRef;

  nomeUser: any;
  cpfUser: any;

  dataCampeonatos: any;
  basicOptions: any;
  tipoAposta: any;

  dadosCards: any;
  chartCampeonatoOption: EChartsOption;
  chartTipoOption: EChartsOption;

  configuracoesTabela: DatagridPrimeConfig = datagridPrimeConfigDefault();
  dados: any;
  colums: any;

  toLocaleFixed = toLocaleFixed;

  constructor(
    private tokenService: TokenService,
    private dashboardService: DashboardService
  ) { }

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

    this.colums = [
      {
        dataField: 'id',
        caption: 'Id',
        dataType: 'string',
        sorting: true
      },
      {
        dataField: 'campeonato_id',
        caption: 'Campeonato',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'time_1',
        caption: 'Time da casa',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'time_2',
        caption: 'Time de fora',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'tipo_aposta_nome',
        caption: 'Tipo aposta',
        dataType: 'string',
        sorting: true,
      },
    ]
  }

  buscarInfosPerfil() {
    this.nomeUser = `${this.tokenService.getJwtDecodedAccess().cli_info.cli_info.nome} ${this.tokenService.getJwtDecodedAccess().cli_info.cli_info.sobrenome}`;
    this.cpfUser = this.tokenService.getJwtDecodedAccess().cli_info.cli_info.cpf;
  }

  buscarDadosDashboard() {
    this.dashboardService.buscarDados(this.cpfUser).subscribe({
      next: (res) => {
        this.dadosCards = {
          odd_media: res.dados.media_odds,
          qtd_apostas: res.dados.qtd_apostas,
          valor_medio: res.dados.valor_apostado,
          tipoAposta: this.returnTipoAposta(res.dados.tipo_aposta_mais_escolhida, res.tipos)
        };

        this.chartCampeonatoOption.xAxis[0].data = res.dados.grafico_campeonatos?.map((item: any) => this.returnCampeonato(item.campeonato, res.campeonatos));

        this.chartCampeonatoOption.series[0].data = res.dados.grafico_campeonatos?.map((item: any) => item.valor);

        this.chartCampeonatoOption = {...this.chartCampeonatoOption}

        this.chartTipoOption.xAxis[0].data = res.dados.grafico_tipo_aposta?.map((item: any) => this.returnTipoAposta(item.tipo_aposta, res.tipos));

        this.chartTipoOption.series[0].data = res.dados.grafico_tipo_aposta?.map((item: any) => item.valor);

        this.chartTipoOption = {...this.chartTipoOption}

        this.dados = res.dados.tabela_aposta ?? [];
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  returnTipoAposta(tipo: string, listaTipo: any) {
    const tipoAposta = listaTipo.find((item: any) => item.id === parseInt(tipo));
    return tipoAposta?.informacao;
  }

  returnCampeonato(campeonato: any, listaCampeonato: any) {
    const nomeCampeonato = listaCampeonato.find((item: any) => item.id === campeonato);
    return nomeCampeonato.nome;
  }

  exportToExcelCampeonato() {
    const data = this.chartCampeonatoOption.series[0].data.map((value: number, index: number) => ({
      Campeonato: this.chartCampeonatoOption.xAxis[0].data[index],
      Valor: value
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'campeonato_data');
  }

  exportToExcelTipo() {
    const data = this.chartTipoOption.series[0].data.map((value: number, index: number) => ({
      Tipo: this.chartTipoOption.xAxis[0].data[index],
      Valor: value
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'tipo_data');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
