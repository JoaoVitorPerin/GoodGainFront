import { UsuariosService } from './../usuarios.service';
import { Component, OnInit } from '@angular/core';
import { DatagridConfig, datagridConfigDefault } from 'src/app/core/ts/datagridConfigDefault';
import { Router } from '@angular/router';
import { ModalConfirmacaoService } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.service';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';

@Component({
  selector: 'app-home-usuarios',
  templateUrl: './home-usuarios.component.html',
  styleUrl: './home-usuarios.component.css'
})
export class HomeUsuariosComponent implements OnInit{
  infosCardsUsuarios = [];
  columsUsuarios: any;
  configuracoesTabela: DatagridConfig = datagridConfigDefault();
  usuarios: any = [];
  
  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private modalConfirmacaoService: ModalConfirmacaoService,
    private toastrService: ToastrService,
  ) {
    this.infosCardsUsuarios = [
      {
        id: 1,
        icon: 'person_check',
        title: 'Usuários ativos',
        value: 0,
      },
      {
        id: 2,
        icon: 'person_off',
        title: 'Usuários inativos',
        value: 0,
      },
      {
        id: 3,
        icon: 'group',
        title: 'Grupos',
        value: 0,
        hasButton: true,
        iconButton: 'edit_note',
        buttonUrl: 'usuarios/grupos/home'
      },
      {
        id: 4,
        icon: 'assignment_ind',
        title: 'Perfis',
        value: 0,
        hasButton: true,
        iconButton: 'edit_note',
        buttonUrl: 'usuarios/perfis/home'
      }
    ];
  }

  ngOnInit(): void {
    this.columsUsuarios = [
      {
        dataField: 'id',
        caption: 'Matrícula',
        dataType: 'string',
        width: 100,
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
        dataField: 'nm_completo',
        caption: 'Nome',
        dataType: 'string',
        cellTemplate(c: any, options: any): void {
        }
      },
      {
        dataField: 'username',
        caption: 'Usuário',
        dataType: 'string',
        cellTemplate(c: any, options: any): void {
          if(!options.data.username){
            c.innerHTML = 'Sem nome de usuário!';
          }
        }
      },
      {
        dataField: 'cpf',
        caption: 'CPF',
        dataType: 'string',
        cellTemplate(c: any, options: any): void {
          if(options.data.cpf){
            const cpfFormatado = options.data.cpf.toString().replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
            c.innerHTML = cpfFormatado;
          }else{
            c.innerHTML = 'Nenhum cpf encontrado!';
          }
        }
      },
    ]

    this.configuracoesTabela.acoes.push(
      {
        icon: 'edit_note',
        color: 'primary',
        icon_tipo: 'material',
        tooltip: 'Editar Usuário',
        show: (row: any): boolean => {
          return true;
        },
        click: (data: any): void => {
          this.router.navigate(['usuarios/cadastro', data.id]);
        }
      },
      {
        icon: 'done',
        color: 'success',
        icon_tipo: 'material',
        tooltip: 'Ativar Usuário',
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
        tooltip: 'Desativar Usuário',
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
      tooltip: 'Adicionar Usuário',
      text: 'Adicionar',
      click: (): void => {
        this.router.navigate(['usuarios/cadastro']);
      }
    })

    this.buscarDadosUsuarios();
  }

  buscarDadosUsuarios(): void {
    this.usuariosService.getInfosUsuarios().subscribe((data: any) => {
      if(data.status){
        this.usuarios = data.lista_funcionarios ? data.lista_funcionarios : [];
        this.infosCardsUsuarios[0].value = data.qtd_ativos;
        this.infosCardsUsuarios[1].value = data.qtd_inativos;
        this.infosCardsUsuarios[2].value = data.qtd_grupos;
        this.infosCardsUsuarios[3].value = data.qtd_perfis;
      }
    });
  }
}
