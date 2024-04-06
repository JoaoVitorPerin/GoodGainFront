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
  formCadastro: FormGroup

  constructor(private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private tokenService: TokenService,
              private router: Router){}

  ngOnInit(): void {
    this.tokenService.clearToken()

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

    // if(this.formCadastro.valid){
    // }

  }

  redirectLogin(){
    this.router.navigate(['login'])
  }
}
