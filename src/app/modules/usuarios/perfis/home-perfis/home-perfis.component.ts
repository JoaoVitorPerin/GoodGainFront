import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatagridConfig, datagridConfigDefault } from 'src/app/core/ts/datagridConfigDefault';
import { UsuariosService } from '../../usuarios.service';

@Component({
  selector: 'app-home-perfis',
  templateUrl: './home-perfis.component.html',
  styleUrl: './home-perfis.component.css'
})
export class HomePerfisComponent implements OnInit{
  columsPerfis: any;
  configuracoesTabela: DatagridConfig = datagridConfigDefault();
  perfis: any = [];

  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
  ) {
  }

  ngOnInit(): void {
    this.columsPerfis = [
      {
        dataField: 'id',
        caption: 'ID',
        width: 100,
        dataType: 'string',
        cellTemplate(c: any, options: any): void {
        }
      },
      {
        dataField: 'status',
        caption: 'Ativo?',
        dataType: 'string',
        width: 100,
        cellTemplate(c: any, options: any): void {
          if (options.data.status){
            c.innerHTML = '<span class="material-symbols-outlined text-green-400 text-3xl">done</span>';
          }else{
            c.innerHTML = '<span class="material-symbols-outlined text-red-400 text-3xl">close</span>';
          }
        }
      },
      {
        dataField: 'nome',
        caption: 'Nome',
        dataType: 'string',
        cellTemplate(c: any, options: any): void {
        }
      },
      {
        dataField: 'descricao',
        caption: 'Descricao',
        dataType: 'string',
        cellTemplate(c: any, options: any): void {
        }
      },
      {
        dataField: 'qtdUsuarios',
        caption: 'Qtd. Usuários',
        dataType: 'string',
        width: 100,
        cellTemplate(c: any, options: any): void {
        }
      },
    ]

    this.configuracoesTabela.acoes.push(
      {
        icon: 'edit_note',
        color: 'primary',
        icon_tipo: 'material',
        tooltip: 'Editar Perfil',
        show: (row: any): boolean => {
          return true;
        },
        click: (data: any): void => {
        }
      },
      {
        icon: 'done',
        color: 'success',
        icon_tipo: 'material',
        tooltip: 'Ativar Perfil',
        show: (row: any): boolean => {
          return row.data.status !== true;
        },
        click: (data: any): void => {
        }
      },
      {
        icon: 'close',
        color: 'danger',
        icon_tipo: 'material',
        tooltip: 'Desativar Perfil',
        show: (row: any): boolean => {
          return row.data.status == true;
        },
        click: (data: any): void => {
        }
      }
    )
  
    this.configuracoesTabela.customButtons.push(
    {
      icon: 'pi pi-plus',
      color: 'primary',
      tooltip: 'Adicionar Perfil',
      text: 'Adicionar',
      click: (): void => {
        this.router.navigate(['usuarios/perfis/cadastro']);
      }
    })

    this.usuariosService.getPerfis().subscribe((res) => {
      this.perfis = res.lista_perfis ? res.lista_perfis : [];
    });
  }
}
