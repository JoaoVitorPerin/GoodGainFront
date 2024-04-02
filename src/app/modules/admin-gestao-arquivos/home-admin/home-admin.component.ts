import { FormGroup, FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { datagridConfigDefault } from "src/app/core/ts/datagridConfigDefault";
import { ToastrService } from "src/app/shared/components/toastr/toastr.service";
import { Router } from '@angular/router';
import { ModalConfirmacaoService } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.service';
import { AdminGestaoArquivosService } from '../admin-gestao-arquivos.module.service';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css'
})
export class HomeAdminComponent {
  formularioPadronizacaoCampos: FormGroup;

  data: Array<any> = [];
  columns: Array<any> = [];

  opcoesPesquisa: any[] = []

  colunas: Array<any> = [];

  configuracoes = datagridConfigDefault()

  grupos: any[] = []

  constructor(
    private formBuilder: FormBuilder,
    private modalConfirmacaoService: ModalConfirmacaoService,
    private router: Router,
    private adminGestaoArquivosService: AdminGestaoArquivosService,
    private toastrService: ToastrService){
  }

  ngOnInit(): void {

    this.configuracoes.refresh = () => {
      this.adminGestaoArquivosService.getBuscarGrupoHome().subscribe((res) => {
        this.grupos = res.valores;
      });
    }

    this.configuracoes.customButtons = [
      {
        icon: 'pi pi-plus',
        color: 'success',
        tooltip: 'Criar novo grupo de arquivos',
        text: 'Adicionar',
        click: () => {
            this.router.navigate(['/admin-arquivos/cadastro/']);
          return
        }
      },
    ]

    this.columns = [
      {
        dataField: 'id',
        caption: 'ID',
        dataType: 'string',
      },
      {
        dataField: 'nm_grupo',
        caption: 'Grupo',
        dataType: 'string',
      },
      {
        dataField: 'descricao',
        caption: 'Descrição',
        dataType: 'string',
      },
    ]

    this.configuracoes.acoes = [
      {
        icon: 'pi pi-pencil',
        color: 'primary',
        tooltip: 'Editar Grupo',
        click: (data: any): void => {
          this.router.navigate(['/admin-arquivos/cadastro/'+data.id]);
        }
      },
      {
        icon: 'pi pi-trash',
        color: 'danger',
        tooltip: 'Deletar Grupo',
        click: (data: any): void => {
          this.modalConfirmacaoService.abrirModalConfirmacao('Deletar Menu', 'Deseja realmente deletar esta tela?', this.excluirGrupo(data.id, () => {
            this.grupos = this.grupos.filter((grupo: any) => grupo.id !== data.id);
          }));
        },
      }
    ]


    this.adminGestaoArquivosService.getBuscarGrupoHome().subscribe((res) => {
      this.grupos = res.valores;
    });
    //this.formularioPadronizacaoCampos.markAllAsTouched()
  }

  excluirGrupo(id: string, afterDeleteCallback: () => void): any {
    this.adminGestaoArquivosService.deleteGrupo(id).subscribe((res) => {
      if(res.status){
        this.toastrService.mostrarToastrSuccess('Grupo deletado com sucesso!');
        afterDeleteCallback();
      }else{
        this.toastrService.mostrarToastrDanger('Erro ao deletar o grupo!')
      }
    });
  }

}
