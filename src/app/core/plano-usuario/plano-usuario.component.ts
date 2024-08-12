import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { PlanoUsuarioService } from './plano-usuario.service';

@Component({
  selector: 'app-plano-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './plano-usuario.component.html',
  styleUrl: './plano-usuario.component.css'
})
export class PlanoUsuarioComponent {
  formularioPlano: FormGroup;
  userCpf: string;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private planoUsuarioService: PlanoUsuarioService,
    private route: Router
  ) {
    this.formularioPlano = this.formBuilder.group({
      cpf: ['', Validators.required],
      plano: ['', Validators.required],
    });

    this.userCpf = this.activatedRoute.snapshot.paramMap.get('id');
  }

  selecionarPlano(tipo) {
    this.formularioPlano.patchValue({cpf: this.userCpf, plano: tipo});
    if(this.formularioPlano.invalid){
      return;
    }

    this.planoUsuarioService.enviarPlanoUsuario(this.formularioPlano.value).subscribe(
      (data) => {
        this.route.navigate(['/home']);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
