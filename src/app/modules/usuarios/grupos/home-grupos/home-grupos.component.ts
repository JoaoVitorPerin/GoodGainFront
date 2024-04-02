import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatagridConfig, datagridConfigDefault } from 'src/app/core/ts/datagridConfigDefault';
import { UsuariosService } from '../../usuarios.service';
import { ModalConfirmacaoService } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.service';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';

@Component({
  selector: 'app-home-grupos',
  templateUrl: './home-grupos.component.html',
  styleUrl: './home-grupos.component.css'
})
export class HomeGruposComponent {
  columsGrupos: any;
  configuracoesTabela: DatagridConfig = datagridConfigDefault();
  grupos: any = [];

  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private modalConfirmacaoService: ModalConfirmacaoService,
    private toastrService: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.columsGrupos = [
      {
        dataField: 'nome',
        caption: 'Nome',
        dataType: 'string',
        width: 150,
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
        dataField: 'nm_descritivo',
        caption: 'Nome descritivo',
        dataType: 'string',
        width: 250,
        cellTemplate(c: any, options: any): void {
        }
      },
      {
        dataField: 'descricao',
        caption: 'Descrição',
        dataType: 'string',
        cellTemplate(c: any, options: any): void {
        }
      },
      {
        dataField: 'nivel',
        caption: 'Nível',
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
        tooltip: 'Editar Grupo',
        icon_tipo: 'material',
        show: (data: any): boolean => {
          return true;
        },
        click: (data: any): void => {
          console.log(data);
          this.router.navigate(['usuarios/grupos/cadastro', data.nome]);
        }
      },
      {
        icon: 'done',
        color: 'success',
        icon_tipo: 'material',
        tooltip: 'Ativar Grupo',
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
        tooltip: 'Desativar Grupo',
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
      tooltip: 'Adicionar Grupo',
      text: 'Adicionar',
      click: (): void => {
        this.router.navigate(['usuarios/grupos/cadastro']);
      }
    })

    this.buscarDadosUsuarios();
  }

  buscarDadosUsuarios(): void {
    this.usuariosService.getInfosGrupos().subscribe((data: any) => {
      if(data.status){
        this.grupos = data.lista_grupos ? data.lista_grupos : [];
      }
    });
  }
}
