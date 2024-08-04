import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { UsuariosService } from '../usuarios.service';
import * as moment from 'moment';
@Component({
  selector: 'app-usuarios-cadastro',
  templateUrl: './usuarios-cadastro.component.html',
  styleUrl: './usuarios-cadastro.component.css'
})
export class UsuariosCadastroComponent {
  formUsuario: FormGroup;
  userCpf: any;

  itemsDualist: any[] = [
    {
      label: 'Item 1',
      value: 1
    },
    {
      label: 'Item 2',
      value: 2
    },
    {
      label: 'Item 3',
      value: 3
    },
  ]

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    private usuarioService: UsuariosService,
    private activatedRoute: ActivatedRoute
  ) {
    this.formUsuario = this.formBuilder.group({
      username: [null, Validators.required],	
      nome: [null, Validators.required],
      sobrenome: [null, Validators.required],
      email: [null, Validators.required],
      cpf: [null, Validators.required],
      data_nasc: [null, Validators.required],
      perfil: [null, Validators.required],
    });

    this.userCpf = this.activatedRoute.snapshot.paramMap.get('id');
    this.formUsuario.patchValue({cpf: this.userCpf});

    if(this.userCpf){
      this.formUsuario.get('cpf').disable();
      this.buscarDadosUsuario(this.userCpf);
    }

    this.buscarAcessos();
  }

  buscarDadosUsuario(cpf){
    this.usuarioService.getUser(cpf).subscribe({
      next: (dados) => {
        const data = { ...dados.cliente };
        data.data_nasc = data.data_nascimento ? moment(data.data_nascimento, 'YYYYMMDD').format('DD/MM/YYYY') : null;
        this.formUsuario.patchValue(data);

      },
      error: (error) => {
        console.error(error);
        this.toastrService.mostrarToastrDanger('Erro ao buscar usuário');
      }
    });
  }

  buscarAcessos(){
    this.usuarioService.getAcessos().subscribe({
      next: (dados) => {
        this.itemsDualist = dados.dados.map(item => ({
          value: item.nivel,
          label: item.nm_descritivo
        }));
      },
      error: (error) => {
        console.error(error);
        this.toastrService.mostrarToastrDanger('Erro ao buscar acessos');
      }
    });
  }

  cancelar(){
    this.router.navigate(['/usuarios/home']);
  }

  desativarUsuario(){
    this.usuarioService.desativarUser(this.userCpf).subscribe(
      (data) => {
        if(data.status){
          this.toastrService.mostrarToastrSuccess('Usuário desativado com sucesso');
        }else{
          this.toastrService.mostrarToastrDanger(data.mensagem ?? 'Erro ao desativar usuário')
        }
      },
      (error) => {
        this.toastrService.mostrarToastrDanger('Erro ao desativar usuário');
      }
    );
  }
  
  salvar(){
    this.formUsuario.markAllAsTouched();

    if(this.formUsuario.invalid){
      this.toastrService.mostrarToastrDanger('Preencha todos os campos obrigatórios');
      return;
    }

    this.usuarioService.setUser(this.formUsuario.getRawValue()).subscribe(
      (data) => {
        if(data.status){
          this.toastrService.mostrarToastrSuccess('Usuário editado com sucesso');
        }else{
          this.toastrService.mostrarToastrDanger(data.mensagem ?? 'Erro ao editar usuário')
        }
      },
      (error) => {
        this.toastrService.mostrarToastrDanger('Erro ao editar usuário');
      }
    );
  }
}
