import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalConfirmacaoService } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.service';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { items } from 'src/app/shared/models/items.model';
import { AdminService } from '../../admin/admin.service';
import { Location } from '@angular/common';
import { UsuariosService } from '../usuarios.service';

@Component({
  selector: 'app-cadastro-usuarios',
  templateUrl: './cadastro-usuarios.component.html',
  styleUrl: './cadastro-usuarios.component.css'
})
export class CadastroUsuariosComponent implements OnInit{
  formularioCadastroUsuarios: FormGroup;
  gruposFuncionario = [];
  perfisFuncionario = [];
  matriculaUsuario: string = '';
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private modalConfirmacaoService: ModalConfirmacaoService,
    private usuariosService: UsuariosService,
    private location: Location
  ) {
  }

  ngOnInit(): void {
    this.formularioCadastroUsuarios = this.formBuilder.group({
      matricula: [null],
      username: [null, Validators.required],
      nm_primeiro: [null, Validators.required],
      email: [null, Validators.required],
      nm_ultimo: [null, Validators.required],
      cpf: [null, Validators.required],
      telefone_completo_form: [null,  Validators.required], 
      data_nascimento: [null],
      lista_grupos_usuario: [null, Validators.required],
      lista_perfis_usuario: [null, Validators.required],
    });

    this.matriculaUsuario = this.activatedRoute.snapshot.paramMap.get('id');
    this.formularioCadastroUsuarios.patchValue({matricula: this.matriculaUsuario});

    if(this.matriculaUsuario){
      this.buscarDadosUsuario(this.matriculaUsuario);
    }
  }

  onSubmit() {
    if (this.formularioCadastroUsuarios?.invalid && this.matriculaUsuario) {
      this.formularioCadastroUsuarios?.markAllAsTouched()
      return;
    }

    this.usuariosService.setUsuario(this.formularioCadastroUsuarios.value).subscribe((res) => {
      if(res.status){
        this.toastrService.mostrarToastrSuccess('Usuário cadastrado com sucesso!');
        this.router.navigate(['/usuarios/cadastro/'+ this.matriculaUsuario]);
      }else{
        this.toastrService.mostrarToastrDanger('Erro ao cadastrar usuário!')
      }
    }, error => {
      this.toastrService.mostrarToastrDanger('Erro ao cadastrar usuário!');
    });
  }

  buscarDadosUsuario(id: string) {
    this.usuariosService.getUsuarioById(id).subscribe((res) => {
      this.formularioCadastroUsuarios.patchValue(res.dict_funcionario);
    });
  }
}
