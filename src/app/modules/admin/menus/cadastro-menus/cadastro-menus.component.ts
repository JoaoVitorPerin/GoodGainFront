import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalConfirmacaoService } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.service';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { AdminService } from '../../admin.service';
import { items } from 'src/app/shared/models/items.model';
import { DatagridConfig, datagridConfigDefault } from 'src/app/core/ts/datagridConfigDefault';
import { Location } from '@angular/common';
import { MenuService } from 'src/app/core/layout/menu/app.menu.service';

@Component({
  selector: 'app-cadastro-menus',
  templateUrl: './cadastro-menus.component.html',
  styleUrl: './cadastro-menus.component.css'
})
export class CadastroMenusComponent implements OnInit{
  formularioCadastroMenus: FormGroup;
  idMenuItem: string = '';
  itemsMenu: Array<items> = [];
  itemsMenuPai: Array<items> = [];
  todosMenus: Array<any> = [];
  columnsMenus = [];
  dataMenus = [];
  menu_id = null;
  idElementoTreelist = "id"
  idPaiTreelist = "menuitempai_id";
  confTreelist: DatagridConfig = datagridConfigDefault();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private modalConfirmacaoService: ModalConfirmacaoService,
    private adminService: AdminService,
    private location: Location,
    private menuService: MenuService
  ) {
  }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.configurarColunasMenus();
  
    this.activatedRoute.queryParams.subscribe(params => {
      this.atualizarDadosComBaseNosParams(params);
    });
  }

  inicializarFormulario() {
    this.formularioCadastroMenus = this.formBuilder.group({
      menuitem_id: [null],
      nome: [null, Validators.required],
      icone: [null, Validators.required],
      url: [null],
      menuitempai_id: [null],
      menu_id: [null,  Validators.required],
      ordem: [null],
      is_salvar_menuitem: [true],
    });
  
    this.formularioCadastroMenus.get('menu_id').valueChanges.subscribe(menuId => {
      this.filtrarMenusPaiporMenuId(menuId);
    });
  }
  
  configurarColunasMenus() {
    this.columnsMenus = [
      {
        dataField: 'ordem',
        caption: 'Ordem',
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
        dataField: 'menu_id',
        caption: 'Menu Id',
        dataType: 'string',
        cellTemplate(c: any, options: any): void {
        }
      },
      {
        dataField: 'url',
        caption: 'URL',
        dataType: 'string',
        cellTemplate(c: any, options: any): void {
          if(options.data.url){
            c.textContent = options.data.url;
          }else{
            c.textContent = 'Nenhuma URL';
          }
        }
      },
    ];

    this.confTreelist.acoes.push(
      {
        icon: 'edit_note',
        color: 'primary',
        icon_tipo: 'material',
        tooltip: 'Editar Menu',
        show: (row: any): boolean => {
          return true;
        },
        click: (data: any): void => {
          this.router.navigate(['/admin/menus/cadastro/'], { queryParams: { menu_id:this.menu_id, menuitem_id: data.id } });
        }
      },
      {
        icon: 'delete',
        color: 'danger',
        tooltip: 'Excluir Menu',
        icon_tipo: 'material',
        show: (row: any): boolean => {
          return true;
        },
        click: (data: any): void => {
          this.modalConfirmacaoService.abrirModalConfirmacao(
            'Excluir',
            'Deseja realmente excluir este menu?',
            {
              icone: 'pi pi-info-circle',
              callbackAceitar: () => {
                this.adminService.deleteMenu(data.id).subscribe((res) => {
                  if(res.status){
                    this.toastrService.mostrarToastrSuccess('Menu excluído com sucesso!');
                    this.buscarDadosMenuItem();
                  }else{
                    this.toastrService.mostrarToastrDanger('Erro ao excluir menu!');
                  }
                });
              }
            }
          )
        }
      },
    )
  }
  
  atualizarDadosComBaseNosParams(params) {
    this.idMenuItem = params['menuitem_id'] ? params['menuitem_id'] : null;
    this.menu_id = params['menu_id'] ? params['menu_id'] : null;
    this.formularioCadastroMenus.patchValue({menuitem_id: parseInt(this.idMenuItem)});
    
    if(this.idMenuItem || this.menu_id){
      this.formularioCadastroMenus.patchValue({menu_id: this.menu_id});
      this.formularioCadastroMenus.patchValue({is_salvar_menuitem: !this.idMenuItem ? false : true});
    }
    
    if (this.menu_id && !this.idMenuItem){
      this.formularioCadastroMenus.disable();
    }else{
      this.formularioCadastroMenus.enable();
    }

    if (this.menu_id){
      this.buscarDadosMenuItem();
    }else{
      this.buscarDadosSelect();
    }
  }
  
  buscarDadosMenuItem() {
    this.adminService.getMenuItemByID(this.menu_id, this.idMenuItem).subscribe((res) => {
        if (res.menuitem) {
          this.formularioCadastroMenus.patchValue(res.menuitem);
        }
        this.todosMenus = res.lista_menuitens;
        this.setarMenusTipo(res);
        this.setarMenusPai(res);
        this.setarMenusTreelist(res.lista_filhos);
    });
  }

  buscarDadosSelect(){
    this.adminService.getMenuItem().subscribe((res) => {
      this.todosMenus = res.lista_menuitens;
      this.setarMenusTipo(res);
      this.setarMenusPai(res);
    });
  }

  onSubmit() {
    if (this.formularioCadastroMenus?.invalid && this.idMenuItem) {
      this.formularioCadastroMenus?.markAllAsTouched()
      return;
    }

    const dados = {
      ...this.formularioCadastroMenus.value,
      lista_filhos: JSON.parse(JSON.stringify(this.dataMenus ? this.dataMenus : [])),
    }

    this.adminService.setMenuItem(dados).subscribe((res) => {
      if(res.status){
        this.menuService.clearSessaoMenus();
        this.menuService.clearMenusStorage();
        this.adminService.atualizarMenu().subscribe(() => {
          this.toastrService.mostrarToastrSuccess('Menu cadastrado com sucesso!');
          this.router.navigate(['admin/menus/cadastro/'], { queryParams: { menu_id:dados.menu_id, menuitem_id: res.menuitem_id } });
          location.reload();
        });
      }else{
        this.toastrService.mostrarToastrDanger('Erro ao cadastrar menu!')
      }
    }, error => {
      this.toastrService.mostrarToastrDanger("Erro ao cadastrar menu!");
    });
  }

  setarMenusTreelist(dados) {
    const idsExistem = dados.map(item => item.id);
  
    this.dataMenus = dados.map(item => {
      return {
        ...item,
        menuitempai_id: idsExistem.indexOf(item.menuitempai_id) !== -1 ? item.menuitempai_id : null
      };
    });
  }

  setarMenusTipo(dados){
    this.itemsMenu = dados.lista_menus.map(item => ({
      value: item.id,
      label: item.nm_descritivo,
    }));
  }

  setarMenusPai(dados){
    this.itemsMenuPai = dados.lista_menuitens
    .filter(item => item.id.toString() !== this.idMenuItem)
    .map(item => ({
      value: item.id,
      label: item.nm_descritivo,
    }));
  }
  
  filtrarMenusPaiporMenuId(menuId: number){
    this.itemsMenuPai = this.todosMenus
      .filter(item => item.menu_id === menuId)
      .map(item => ({
        value: item.id,
        label: item.nm_descritivo,
      }));
  }
}