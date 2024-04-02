import { AdminGestaoArquivosService } from './../admin-gestao-arquivos.module.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/core/layout/app.layout.service';
import { ModalConfirmacaoService } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.service';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { items } from 'src/app/shared/models/items.model';

@Component({
  selector: 'app-cadastro-admin',
  templateUrl: './cadastro-admin.component.html',
  styleUrl: './cadastro-admin.component.css'
})
export class CadastroAdminComponent {
  formularioCadastroGrupos: FormGroup;
  idGrupo: string = '';
  itemsVersao: Array<items> = [];
  itemsModulo: Array<items> = [];

  administradores: Array<items> = [];
  administradoresSelecionados: []
  usuariosSelecionados: []
  usuarios: Array<items> = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private modalConfirmacaoService: ModalConfirmacaoService,
    private layoutService: LayoutService,
    private adminGestaoArquivosService: AdminGestaoArquivosService
  ){
    this.formularioCadastroGrupos = this.formBuilder.group({
      grupo_id: [null],
      nome: [null, Validators.required],
      descricao: [null, Validators.required],
      administradores: [null],
      usuarios: [null]
    })
  }
  ngOnInit(): void {

    this.idGrupo = this.activatedRoute.snapshot.paramMap.get('id');
    this.formularioCadastroGrupos.patchValue({grupo_id: this.idGrupo});

    if (this.idGrupo) {
      this.adminGestaoArquivosService.getGrupoByID(this.idGrupo).subscribe((res) => {
        this.administradores = res.administradores?.funcionario
        this.usuarios = res.usuarios?.funcionario
        this.formularioCadastroGrupos?.patchValue(res.cadastro)
      });
    }else{
      this.adminGestaoArquivosService.getCadastroGrupo().subscribe((res) => {
        this.setModuloItems(res.lista_modulos)
        this.setVersaoItems(res.lista_versoes)
        this.administradores = res.administradores?.funcionario
        this.usuarios = res.usuarios?.funcionario
      });
    }
  }

  onSubmit() {
    this.formularioCadastroGrupos?.markAllAsTouched()

    if (this.formularioCadastroGrupos?.invalid) {
      return;
    }

    this.adminGestaoArquivosService.setSalvarGrupo(this.formularioCadastroGrupos.value).subscribe((res) => {
      if(res.status){
        this.toastrService.mostrarToastrSuccess('Grupo cadastrada com sucesso!');
        // this.router.navigate(['/home']);
      }else{
        this.toastrService.mostrarToastrDanger('Erro ao cadastrar a grupo!')
      }
    });
  }


  setVersaoItems(items: Array<any>) {
    if(!items) return;
    this.itemsVersao = items?.map(item => ({
      value: item.id,
      label: `${item.versao} - ${item.descricao}`,
    }));
  }

  setModuloItems(items: Array<any>) {
    if(!items) return;
    this.itemsModulo = items?.map(item => ({
      value: item.id,
      label: item.nome,
    }));
  }
}
