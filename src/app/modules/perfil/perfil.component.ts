import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TokenService } from 'src/app/core/services/token.service';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import * as dayjs from 'dayjs'
import { LoginService } from 'src/app/core/services/login.service';
import * as moment from 'moment';
import { PerfilService } from './perfil.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormModule,
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit{
  formPerfil: FormGroup;
  formPreferencias: FormGroup;
  maxDate: any;
  dayjs = dayjs;
  buttonSalvar: any;
  username: any = '--';
  cpfUser: any = '--';
  emailUser: any = '--';
  
  itemsEsporte: any = [];
  itemsTipoAposta: any = [];

  constructor(private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private tokenService: TokenService,
    private loginService: LoginService,
    private perfilService: PerfilService,
    private router: Router){}

  ngOnInit(){
    this.formPreferencias = this.formBuilder.group({
      esporte: [null],
      opcoes_apostas: [null]
    });

    this.formPerfil = this.formBuilder.group({
      nome: [null, Validators.required],
      sobrenome: [null, Validators.required],
      cpf: [null, Validators.required],
      data_nascimento: [null, Validators.required],
      username: [null, Validators.required],
      email: [null, Validators.required],
    })

    this.maxDate = new Date(this.dayjs().toDate());

    Object.keys(this.formPerfil.controls).forEach(key => {
      this.formPerfil.get(key).disable();
    });

    this.buttonSalvar = false;
    this.buscarInfosPerfil();
  }

  buscarInfosPerfil(){
    const cpfUser = this.tokenService.getJwtDecoded().cli_info.cpf;

    this.loginService.buscarUserByCpf(cpfUser).subscribe({
      next: (dados) => {
        this.username = dados.cliente.username;
        this.cpfUser = dados.cliente.cpf;
        this.emailUser = dados.cliente.email;
        
        this.buscarPreferencias();

        const data = { ...dados.cliente };
        data.data_nascimento = data.data_nascimento ? moment(data.data_nascimento, 'YYYYMMDD').format('DD/MM/YYYY') : null;
        this.formPerfil.patchValue(data);
      }, error: () => {
        this.toastrService.mostrarToastrDanger('Nao foi possivel buscar os dados do username, contate o suporte!')
      }
    })
  }

  buscarPreferencias(){
    this.perfilService.buscarPreferencias(this.cpfUser).subscribe({
      next: (dados) => {
        this.itemsEsporte = dados.dados.esporte?.map(item => ({
          value: item.id,
          label: item.nome
        }));

        this.itemsTipoAposta = dados.dados.opcoes_apostas?.map(item => ({
          value: item.id,
          label: item.informacao
        }));
      }, error: () => {
        this.toastrService.mostrarToastrDanger('Nao foi possivel buscar as preferencias, contate o suporte!')
      }
    })
  }

  toggleCamposDisable() {
    this.buttonSalvar = !this.buttonSalvar;
    Object.keys(this.formPerfil.controls).forEach(key => {
      const control = this.formPerfil.get(key);
      if (control.enabled) {
        control.disable();
      } else {
        control.enable();
      }
    });
  }

  onSubmit(){
    if (this.formPerfil.getRawValue().invalid) {
      this.formPerfil?.markAllAsTouched()
      return;
    }

    const dados = {
      ...this.formPerfil.getRawValue(),
      data_nascimento: moment(this.formPerfil.value.data_nascimento, 'DD/MM/YYYY').format('YYYYMMDD')
    }

    this.loginService.editarUser(dados).subscribe((res) => {
      if(res.status){
        this.toastrService.mostrarToastrSuccess('Usuário editado com sucesso!');
        this.toggleCamposDisable();
      }else{
        this.toastrService.mostrarToastrDanger('Erro ao editar usuário!')
      }
    }, error => {
      this.toastrService.mostrarToastrDanger('Erro ao editar usuário!');
    });
  }

  onSubmitPreferencias(){
    if (this.formPreferencias.getRawValue().invalid) {
      this.formPreferencias?.markAllAsTouched()
      return;
    }

    const dados = {
      ...this.formPreferencias.getRawValue(),
      cpf: this.cpfUser
    }

    this.perfilService.enviarPreferencias(dados).subscribe((res) => {
      if(res.status){
        this.toastrService.mostrarToastrSuccess('Preferências editadas com sucesso!');
      }else{
        this.toastrService.mostrarToastrDanger('Erro ao editar preferências!')
      }
    }, error => {
      this.toastrService.mostrarToastrDanger('Erro ao editar preferências!');
    });
  }
}
