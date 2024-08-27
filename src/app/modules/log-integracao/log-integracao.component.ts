import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { HomeSimulacaoService } from '../home-simulacao/home-simulacao.service';
import { LayoutService } from 'src/app/core/layout/app.layout.service';
import { TokenService } from 'src/app/core/services/token.service';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { DatagridPrimeModule } from 'src/app/shared/components/datagrid-prime/datagrid-prime.module';
import { DatagridPrimeConfig, datagridPrimeConfigDefault } from 'src/app/core/ts/datagridPrimeConfigDefault';
import { LogIntegracaoService } from './log-integracao.service';
import * as moment from 'moment';
import { ModalConfirmacaoService } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.service';

@Component({
  selector: 'app-log-integracao',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormModule,
    FormsModule,
    CommonModule,
    ButtonModule,
    FieldsetModule,
    DatagridPrimeModule
  ],
  templateUrl: './log-integracao.component.html',
  styleUrl: './log-integracao.component.css'
})
export class LogIntegracaoComponent implements OnInit{
  dadosIntegracao: FormGroup;
  configuracoesTabela: DatagridPrimeConfig = datagridPrimeConfigDefault();
  @ViewChild('templateStatus', { static: true }) templateStatus: TemplateRef<any>;

  dados: any;
  colums: any;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private logIntegracaoService: LogIntegracaoService,
    private modalConfirmacaoService: ModalConfirmacaoService
  ) {
    this.dadosIntegracao = this.formBuilder.group({
      data: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.colums = [
      {
        dataField: 'id',
        caption: 'ID',
        dataType: 'string',
        sorting: true
      },
      {
        dataField: 'data',
        caption: 'Data',
        dataType: 'string',
        sorting: true,
        cellTemplate: 'date'
      },
      {
        dataField: 'status',
        caption: 'Status',
        dataType: 'string',
        sorting: true,
        cellTemplate: this.templateStatus
      }
    ]

    this.buscarDadosApi();
  }

  buscarDadosApi(){
    this.logIntegracaoService.buscarDados().subscribe({
      next: (dados) => {
        this.dados = dados.dados;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  chamarApi(){
    this.dadosIntegracao.markAllAsTouched();
    
    if(this.dadosIntegracao.invalid){
      return
    }

    this.modalConfirmacaoService.abrirModalConfirmacao(
      'Dados',
      'Deseja realmente buscar os do desse dia?',
      {
        icone: 'pi pi-info-circle',
        callbackAceitar: () => {
          const dados = {
            data:  moment(this.dadosIntegracao.get('data').value, 'DD/MM/YYYY').format('YYYY-MM-DD')
          }
      
          this.logIntegracaoService.chamarApi(dados).subscribe({
            next: (dados) => {
              this.toastrService.mostrarToastrSuccess('Dados atualizados com sucesso');
              this.buscarDadosApi();
            },
            error: (error) => {
              console.error(error);
            }
          });
        }
      }
    )
  }

  chamarDadosHistorico(){
    this.modalConfirmacaoService.abrirModalConfirmacao(
      'Dados históricos',
      'Deseja realmente buscar o histórico do dia anterior?',
      {
        icone: 'pi pi-info-circle',
        callbackAceitar: () => {
          this.logIntegracaoService.buscarDadosHistorico().subscribe({
            next: (dados) => {
              this.toastrService.mostrarToastrSuccess('Dados atualizados com sucesso');
              this.buscarDadosApi();
            },
            error: (error) => {
              console.error(error);
            }
          });
        }
      }
    )
  }
}
