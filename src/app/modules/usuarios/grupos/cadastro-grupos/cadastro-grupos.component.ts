import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalConfirmacaoService } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.service';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { items } from 'src/app/shared/models/items.model';
import { AdminService } from '../../../admin/admin.service';
import { Location } from '@angular/common';
import { UsuariosService } from '../../usuarios.service';

@Component({
  selector: 'app-cadastro-grupos',
  templateUrl: './cadastro-grupos.component.html',
  styleUrl: './cadastro-grupos.component.css'
})
export class CadastroGruposComponent implements OnInit{
  formularioCadastroGrupos: FormGroup;
  nomeGrupo: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private modalConfirmacaoService: ModalConfirmacaoService,
    private adminService: AdminService,
    private location: Location,
    private usuariosService: UsuariosService
  ) {
  }

  ngOnInit(): void {
    this.formularioCadastroGrupos = this.formBuilder.group({
      nome: [null],
      nm_descritivo: [null, Validators.required],
      nivel: [null],
      descricao: [null],
    });

    this.nomeGrupo = this.activatedRoute.snapshot.paramMap.get('id');
    this.formularioCadastroGrupos.patchValue({id_grupo: this.nomeGrupo});

    if(this.nomeGrupo){
      this.formularioCadastroGrupos.get('nome').disable();
      this.buscarDadosGrupo(this.nomeGrupo);
    }
  }

  buscarDadosGrupo(name: string) {
    this.usuariosService.getGrupoByName(name).subscribe((res) => {
      if(res.status){
        this.formularioCadastroGrupos.patchValue(res.dict_grupo);
      }else{
        this.toastrService.mostrarToastrDanger("Erro ao buscar dados do grupo");
      }
    });
  }

  onSubmit() {
    if (this.formularioCadastroGrupos?.invalid && this.nomeGrupo) {
      this.formularioCadastroGrupos?.markAllAsTouched()
      return;
    }

    this.usuariosService.setGrupo(this.formularioCadastroGrupos.value).subscribe((res) => {
      if(res.status){
        this.toastrService.mostrarToastrSuccess("Grupo salvo com sucesso");
        this.router.navigate(['/usuarios/grupos/cadastro/'+ res.grupo_id]);
      }else{
        this.toastrService.mostrarToastrDanger("Erro ao salvar grupo!");
      }
    }, error => {
      this.toastrService.mostrarToastrDanger("Erro ao salvar grupo!");
    });
  }
}
