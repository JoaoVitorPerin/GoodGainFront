import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { ButtonModule } from 'primeng/button';
import { ElementoFocoDirective } from 'src/app/shared/directives/elemento-foco.directive';
import { AtalhoEventoDirective } from 'src/app/shared/directives/atalho-evento.directive';
import { validatorSenhaForte, confirmPasswordValidator } from '../../shared/validator/validatorForm';
import { LoginService } from '../services/login.service';
import * as dayjs from 'dayjs'
import moment from 'moment';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormModule,
    ButtonModule,
    ElementoFocoDirective,
    AtalhoEventoDirective
  ],
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.css'
})
export class CadastroUsuarioComponent implements OnInit{
  formCadastro: FormGroup;
  maxDate: any;
  dayjs = dayjs;

  constructor(private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private tokenService: TokenService,
              private router: Router,
              private loginService: LoginService){}

  ngOnInit(): void {
    this.tokenService.clearToken()

    this.maxDate = new Date(this.dayjs().toDate());

    this.formCadastro = this.formBuilder.group({
      nome: [null, Validators.required],
      sobrenome: [null, Validators.required],
      cpf: [null, Validators.required],
      dataNascimento: [null, Validators.required],
      username: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, validatorSenhaForte()]],
      confirmPassword: [null, [Validators.required, validatorSenhaForte()]],
    },{ validators: confirmPasswordValidator })
  }

  register(): void {
    this.formCadastro.markAllAsTouched()

    if(this.formCadastro.valid){

      const dados = {
        ...this.formCadastro.getRawValue(),
        data_nascimento: moment(this.formPerfil.value.data_nascimento, 'DD/MM/YYYY').format('YYYYMMDD')
      }

      this.loginService.cadastro(dados).subscribe({
        next: (dados) => {
          if(dados.status){
              this.toastrService.mostrarToastrSuccess('Cadastro realizado com sucesso!')
              this.redirectLogin()
          } else {
            this.toastrService.mostrarToastrDanger('Não foi possível realizar o cadastro. Tente novamente e caso persista o erro, contate o suporte.')
          }
        }, error: () => {
          this.toastrService.mostrarToastrDanger('Não foi possível realizar o cadastro. Tente novamente e caso persista o erro, contate o suporte.')
        }
      })

    } else {
      this.toastrService.mostrarToastrDanger('Informe todos os campos de cadastro!')
    }

  }

  redirectLogin(){
    this.router.navigate(['login'])
  }
}
