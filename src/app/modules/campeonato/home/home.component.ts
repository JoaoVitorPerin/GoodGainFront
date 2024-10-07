import { CampeonatoService } from './../campeonato.service';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatagridPrimeConfig, datagridPrimeConfigDefault } from 'src/app/core/ts/datagridPrimeConfigDefault';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  configuracoesTabela: DatagridPrimeConfig = datagridPrimeConfigDefault();
  dados: any;
  colums: any;

  @ViewChild('templateStatus', { static: true }) templateStatus: TemplateRef<any>;

  constructor(
    private toastrService: ToastrService,
    private router: Router,
    private campeonatoService: CampeonatoService
  ){}

  ngOnInit(): void {
    this.colums = [
      {
        dataField: 'id',
        caption: 'ID',
        dataType: 'string',
        sorting: true
      },
      {
        dataField: 'nome',
        caption: 'Nome completo',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'season_atual',
        caption: 'Season Atual',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'status',
        caption: 'Status',
        dataType: 'string',
        sorting: true,
        cellTemplate: this.templateStatus
      },
      {
        dataField: 'acoes',
        caption: 'Ações',
        dataType: 'string',
        sorting: true
      }
    ];

    this.configuracoesTabela.actionButtons.push({
      icon: 'close',
      iconType: 'material',
      color: 'danger',
      tooltip: 'Desativar Campeonato',
      show: (rowData): boolean => {
        return rowData?.status
      },
      click: (rowData): void => {
        this.alterarStratusCampeonato(rowData?.id)
      }
    })

    this.configuracoesTabela.actionButtons.push({
      icon: 'done',
      iconType: 'material',
      color: 'success',
      tooltip: 'Ativar Campeonato',
      show: (rowData): boolean => {
        return !rowData?.status
      },
      click: (rowData): void => {
        this.alterarStratusCampeonato(rowData?.id)
      }
    })

    this.buscarCampeonatos();
  }

  alterarStratusCampeonato(id: any): void {
    this.campeonatoService.alterarStatusCampeonato(id).subscribe(
      (data) => {
        this.toastrService.mostrarToastrSuccess('Campeonato alterado com sucesso');
        this.buscarCampeonatos();
      },
      (error) => {
        this.toastrService.mostrarToastrDanger('Erro ao alterar o campeonato');
      })
  }

  buscarCampeonatos(): void {
    this.campeonatoService.getAllCampeonatos().subscribe(
      (data) => {
        this.dados = data.campeonatos;
      },
      (error) => {
        this.toastrService.mostrarToastrDanger('Erro ao salvar usuário');
    })
  }
}
