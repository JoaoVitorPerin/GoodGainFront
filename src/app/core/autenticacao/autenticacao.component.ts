import { LoginService } from './../services/login.service';
import { TokenService } from 'src/app/core/services/token.service';
import { CommonModule } from '@angular/common';
import { AtalhoEventoDirective } from 'src/app/shared/directives/atalho-evento.directive';
import { ElementoFocoDirective } from './../../shared/directives/elemento-foco.directive';
import { ToastrService } from './../../shared/components/toastr/toastr.service';
import { ButtonModule } from 'primeng/button';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormModule } from './../../shared/components/form/form.module';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from "@angular/router";
import { confirmPasswordValidator, validatorSenhaForte } from 'src/app/shared/validator/validatorForm';

@Component({
  selector: 'app-autenticacao',
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
  templateUrl: './autenticacao.component.html',
  styleUrl: './autenticacao.component.css'
})
export class AutenticacaoComponent implements OnInit {

  @ViewChild('modalInserirDigital') modalInserirDigital: TemplateRef<any>

  formLogin: FormGroup;
  formRecuperacaoSenha: FormGroup;
  formNovaSenha: FormGroup;
  mostrarFormCodigo: boolean = false;
  mostrarEsqueceuSenha: boolean = false;
  
  constructor(private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private tokenService: TokenService,
              private router: Router,
              private loginService: LoginService){}

  ngOnInit(): void {
    this.tokenService.clearToken()

    this.formLogin = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    })

    this.formRecuperacaoSenha = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]]
    })

    this.formNovaSenha = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      codigo: [null, Validators.required],
      password: [null, [Validators.required, validatorSenhaForte()]],
      confirm_password: [null, [Validators.required, validatorSenhaForte()]]
    },{ validators: confirmPasswordValidator })
  }

  login(): void {

    this.formLogin.markAllAsTouched()

    if(this.formLogin.valid){
      this.loginService.login(this.formLogin.getRawValue()).subscribe({
        next: (dados) => {
          if(dados.status){
            this.tokenService.setToken(dados?.token)
            this.router.navigate(['wiki', 'forms'])
          } else {
            this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Não foi possível realizar o login. Tente novamente e caso persista o erro, contate o suporte.')
          }
        }, error: () => {
          this.toastrService.mostrarToastrDanger('Não foi possível realizar o login. Tente novamente e caso persista o erro, contate o suporte.')
        }
      })
    } else {
      this.toastrService.mostrarToastrDanger('Informe o login e senha para prosseguir')
    }
  }

  enviarEmailRecuperacaoSenha(): void {
    this.formRecuperacaoSenha.markAllAsTouched()

    if(this.formRecuperacaoSenha.valid){
      this.loginService.enviarEmailRecuperacaoSenha(this.formRecuperacaoSenha.getRawValue()).subscribe({
        next: (dados) => {
          if(dados.status){
            this.toastrService.mostrarToastrSuccess('E-mail enviado com sucesso. Verifique sua caixa de entrada e spam!.')
            this.mostrarFormCodigo = true;
          } else {
            this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Não foi possível enviar o e-mail de recuperação de senha. Tente novamente e caso persista o erro, contate o suporte.')
          }
        }, error: () => {
          this.toastrService.mostrarToastrDanger('Não foi possível enviar o e-mail de recuperação de senha. Tente novamente e caso persista o erro, contate o suporte.')
        }
      })
    } 
  }

  enviarNovaSenha(): void {
    this.formNovaSenha.markAllAsTouched()
    if(this.formNovaSenha.valid){
      this.toastrService.mostrarToastrSuccess('Senha alterada com sucesso.')
      console.log(this.formNovaSenha.getRawValue())
      this.mostrarFormCodigo = false;
      this.mostrarEsqueceuSenha = false;
      console.log(this.mostrarEsqueceuSenha && this.mostrarFormCodigo)
    } 
  }

  alternarFormulario() {
    this.mostrarEsqueceuSenha = !this.mostrarEsqueceuSenha;
  }

  redirectCadastro(){
    this.router.navigate(['cadastro'])
  }
}
