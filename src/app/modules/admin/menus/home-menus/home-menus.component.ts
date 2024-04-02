import { MenuService } from './../../../../core/layout/menu/app.menu.service';
import { map } from 'rxjs/operators';
import { ToastrService } from './../../../../shared/components/toastr/toastr.service';
import { AdminService } from './../../admin.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DatagridConfig, datagridConfigDefault } from 'src/app/core/ts/datagridConfigDefault';
import { ModalConfirmacaoService } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.service';

@Component({
  selector: 'app-home-menus',
  templateUrl: './home-menus.component.html',
  styleUrl: './home-menus.component.css'
})
export class HomeMenusComponent implements OnInit{
  columsMenus: any;
  configuracoesTabela: DatagridConfig = datagridConfigDefault();
  menus: any = [];
  
  constructor(
    private adminService: AdminService,
    private router: Router,
    private toastrService: ToastrService,
    private modalConfirmacaoService: ModalConfirmacaoService,
    private menuService: MenuService
    ){
  }
  ngOnInit(): void {
    this.columsMenus = [
      {
        dataField: 'id',
        caption: 'ID',
        dataType: 'string',
        cellTemplate(c: any, options: any): void {
        }
      },
      {
        dataField: 'nm_descritivo',
        caption: 'Nome',
        dataType: 'string',
        cellTemplate(c: any, options: any): void {
        }
      },
      {
        dataField: 'qtd_filhos',
        caption: 'Qtd. Filhos',
        dataType: 'string',
        width: 60,
        cellTemplate(c: any, options: any): void {
        }
      },
    ]

    this.configuracoesTabela.acoes.push(
    {
      icon: 'edit_note',
      color: 'primary',
      tooltip: 'Editar Menu',
      icon_tipo: 'material',
      show: (data: any): boolean => {
        return true;
      },
      click: (data: any): void => {
        this.router.navigate(['/admin/menus/cadastro/'], { queryParams: { menu_id: data.id } });
      }
    },
    )


    this.configuracoesTabela.customButtons.push(
    {
      icon: 'pi pi-plus',
      color: 'primary',
      tooltip: 'Adicionar Menu',
      text: 'Adicionar',
      click: (): void => {
        this.router.navigate(['/admin/menus/cadastro/']);
      }
    }
    )

    this.adminService.getMenus().subscribe((res) => {
      this.menus = res.lista_menus ? res.lista_menus.map((menu: any) => {
        return {
          id: menu.menu_id,
          nm_descritivo: `Menu ${menu.menu_id}`,
          qtd_filhos: menu.dados.length,
        }
      }) : [];
    });
  }

  excluirRegistro(id: string,afterDeleteCallback: () => void): any {
    this.adminService.deleteMenu(id).subscribe((res) => {
      if(res.status){
        this.toastrService.mostrarToastrSuccess('Menu deletado com sucesso!');
        afterDeleteCallback();
      }else{
        this.toastrService.mostrarToastrDanger('Erro ao deletar menu!')
      }
    });
  }
}