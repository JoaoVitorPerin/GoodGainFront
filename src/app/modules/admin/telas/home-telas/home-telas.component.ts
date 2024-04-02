import { Component } from '@angular/core';
import { DatagridConfig, datagridConfigDefault } from 'src/app/core/ts/datagridConfigDefault';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { ModalConfirmacaoService } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.service';
import * as moment from 'moment';

@Component({
  selector: 'app-home-telas',
  templateUrl: './home-telas.component.html',
  styleUrl: './home-telas.component.css'
})
export class HomeTelasComponent {
  //configs tabela de telas
  columsTelas: any;
  configuracoesTabela: DatagridConfig = datagridConfigDefault();
  telas: any = [];

  //configs tabela de versões
  columsVersoes: any;
  configuracoesTabelaVersoes: DatagridConfig = datagridConfigDefault();
  versoes: any = [];

  constructor(
    private adminService: AdminService,
    private router: Router,
    private toastrService: ToastrService,
    private modalConfirmacaoService: ModalConfirmacaoService
    ){
  }

  ngOnInit(): void {
    this.columsTelas = [
      {
        dataField: 'id',
        caption: 'ID',
        dataType: 'string',
        width: 30,
        cellTemplate(c: any, options: any): void {
          if (options.data.id) {
            c.parentNode.classList.add('cursor-pointer');
            c.classList.add('py-2');
          }
        }
      },
      {
        dataField: 'nome',
        caption: 'Nome',
        dataType: 'string',
        width: 150,
        cellTemplate(c: any, options: any): void {
        }
      },
      {
        dataField: 'codigo',
        caption: 'Código',
        dataType: 'string',
        cellTemplate(c: any, options: any): void {
        }
      },
      {
        dataField: 'descricao',
        caption: 'Descrição',
        dataType: 'string',
        width: 400,
        cellTemplate(c: any, options: any): void {
        }
      },
      {
        dataField: 'url',
        caption: 'URL',
        dataType: 'string',
        cellTemplate(c: any, options: any): void {
        }
      },
      {
        dataField: 'ajuda',
        caption: 'Ajuda',
        dataType: 'string',
        visible: false,
        cellTemplate(c: any, options: any): void {
        }
      },
      {
        dataField: 'tags',
        caption: 'Tags',
        dataType: 'string',
        visible: false,
        cellTemplate(c: any, options: any): void {
        }
      },
      {
        dataField: 'ultima_versao_id',
        caption: 'Versão ID',
        dataType: 'string',
        cellTemplate(c: any, options: any): void {
        }
      },
      {
        dataField: 'modulo_id',
        caption: 'Módulo ID',
        dataType: 'string',
        visible: false,
        cellTemplate(c: any, options: any): void {
        }
      },
    ]

    this.configuracoesTabela.acoes.push(
    {
      icon: 'edit_note',
      color: 'primary',
      tooltip: 'Editar Tela',
      icon_tipo: 'material',
      show: (data: any): boolean => {
        return true;
      },
      click: (data: any): void => {
        this.router.navigate(['/admin/telas/cadastro/'+data.id]);
      }
    },
    {
      icon: 'delete',
      color: 'danger',
      tooltip: 'Deletar Tela',
      icon_tipo: 'material',
      show: (data: any): boolean => {
        return true;
      },
      click: (data: any): void => {
        this.modalConfirmacaoService.abrirModalConfirmacao('Deletar Menu', 'Deseja realmente deletar esta tela?', this.excluirTela(data.id, () => {
          this.telas = this.telas.filter((tela: any) => tela.id !== data.id);
        }));
      },
    }
    )

    this.configuracoesTabela.customButtons.push(
    {
      icon: 'pi pi-plus',
      color: 'primary',
      tooltip: 'Adicionar Tela',
      text: 'Adicionar',
      click: (): void => {
        this.router.navigate(['/admin/telas/cadastro/']);
      }
    }
    )

    this.columsVersoes = [
      {
        dataField: 'id',
        caption: 'ID',
        dataType: 'string',
        width: 30,
        cellTemplate(c: any, options: any): void {
          if (options.data.id) {
            c.parentNode.classList.add('cursor-pointer');
            c.classList.add('py-2');
          }
        }
      },
      {
        dataField: 'versao',
        caption: 'Versão',
        dataType: 'string',
        width: 150,
        cellTemplate(c: any, options: any): void {
        }
      },
      {
        dataField: 'data',
        caption: 'Data',
        dataType: 'string',
        cellTemplate(c: any, options: any): void {
          const data = options.data.data;
          if(data){
            const formattedDate = moment(data, 'YYYY/MM/DD').format('DD/MM/YYYY');
            c.textContent = formattedDate;
          }
        }
      },
      {
        dataField: 'descricao',
        caption: 'Descrição',
        dataType: 'string',
        width: 400,
        cellTemplate(c: any, options: any): void {
        }
      },
      {
        dataField: 'tela_id',
        caption: 'Tela',
        dataType: 'string',
        cellTemplate(c: any, options: any): void {
        }
      },
    ]

    this.configuracoesTabelaVersoes.acoes.push(
    {
      icon: 'edit_note',
      color: 'primary',
      tooltip: 'Editar Versão',
      icon_tipo: 'material',
      show: (data: any): boolean => {
        return true;
      },
      click: (data: any): void => {
        this.router.navigate(['/admin/versoes/cadastro/'+data.id]);
      }
    },
    {
      icon: 'delete',
      color: 'danger',
      tooltip: 'Deletar Versão',
      icon_tipo: 'material',
      show: (data: any): boolean => {
        return true;
      },
      click: (data: any): void => {
        this.modalConfirmacaoService.abrirModalConfirmacao('Deletar Versão', 'Deseja realmente deletar esta versão?', this.excluirVersao(data.id, () => {
          this.versoes = this.versoes.filter((versao: any) => versao.id !== data.id);
        }));
      },
    }
    )

    this.configuracoesTabelaVersoes.customButtons.push(
    {
      icon: 'pi pi-plus',
      color: 'primary',
      tooltip: 'Adicionar Versão',
      text: 'Adicionar',
      click: (): void => {
        this.router.navigate(['/admin/versoes/cadastro/']);
      }
    }
    )

    this.adminService.getTelasHome().subscribe((res) => {
      this.telas = res.lista_telas ? res.lista_telas : [];
    });

    this.adminService.getVersoesHome().subscribe((res) => {
      this.versoes = res.lista_versoes ? res.lista_versoes : [];
    });
  }

  excluirVersao(id: string, afterDeleteCallback: () => void): any {
    this.adminService.deleteVersao(id).subscribe((res) => {
      if(res.status){
        this.toastrService.mostrarToastrSuccess('Versão deletada com sucesso!');
        afterDeleteCallback();
      }else{
        this.toastrService.mostrarToastrDanger('Erro ao deletar a versão!')
      }
    });
  }

  excluirTela(id: string, afterDeleteCallback: () => void): any {
    this.adminService.deleteTela(id).subscribe((res) => {
      if(res.status){
        this.toastrService.mostrarToastrSuccess('Tela deletada com sucesso!');
        afterDeleteCallback();
      }else{
        this.toastrService.mostrarToastrDanger('Erro ao deletar a tela!')
      }
    });
  }
}
