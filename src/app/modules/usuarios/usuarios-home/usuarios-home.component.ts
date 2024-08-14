import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatagridPrimeConfig, datagridPrimeConfigDefault } from 'src/app/core/ts/datagridPrimeConfigDefault';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { UsuariosService } from '../usuarios.service';

@Component({
  selector: 'app-usuarios-home',
  templateUrl: './usuarios-home.component.html',
  styleUrl: './usuarios-home.component.css'
})
export class UsuariosHomeComponent {
  configuracoesTabela: DatagridPrimeConfig = datagridPrimeConfigDefault();
  dados: any;
  colums: any;

  @ViewChild('templateStatus', { static: true }) templateStatus: TemplateRef<any>;

  constructor(
    private toastrService: ToastrService,
    private router: Router,
    private usuariosService: UsuariosService
  ){}

  ngOnInit(): void {
    this.usuariosService.getAllUsers().subscribe(
      (data) => {
        this.dados = data.dados;
      },
      (error) => {
        this.toastrService.mostrarToastrDanger('Erro ao salvar usuário');
      })

    this.colums = [
      {
        dataField: 'cpf',
        caption: 'CPF',
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
      icon: 'edit',
      iconType: 'material',
      color: 'primary',
      tooltip: 'Editar Usuário',
      click: (rowData): void => {
        this.router.navigate(['usuarios/cadastro', rowData?.cpf])
      }
    })
  }
}
