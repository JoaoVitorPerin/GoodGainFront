import { ModalConfirmacaoModule } from './../../../../../shared/components/modal-confirmacao/modal-confirmacao.module';
import { Router } from '@angular/router';
import { ToastrService } from './../../../../../shared/components/toastr/toastr.service';
import { ModalConfirmacaoService } from './../../../../../shared/components/modal-confirmacao/modal-confirmacao.service';
import { AtalhoEventoDirective } from 'src/app/shared/directives/atalho-evento.directive';
import { ButtonModule } from 'primeng/button';
import { ElementoFocoDirective } from './../../../../../shared/directives/elemento-foco.directive';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { LabelComponent } from './../../../../../shared/components/label/label.component';
import { LocalService } from './../../local.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardModule } from "primeng/card";
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-recarga',
  standalone: true,
  imports: [
    CardModule,
    LabelComponent,
    ReactiveFormsModule,
    FormModule,
    ElementoFocoDirective,
    ButtonModule,
    AtalhoEventoDirective,
    ModalConfirmacaoModule,
    SkeletonModule
  ],
  templateUrl: './recarga.component.html',
  styleUrl: './recarga.component.css'
})
export class RecargaComponent implements OnInit, OnDestroy {

  operadoras: Array<any> = []
  valoresRecarga: Array<any> = []

  subs: Subscription[] = []

  formOperadora: FormGroup

  loadingOperadoras: boolean = true
  loadingValoresRecargas: boolean = true

  constructor(private localService: LocalService,
              private formBuilder: FormBuilder,
              private modalConfirmacaoService: ModalConfirmacaoService,
              private toastrService: ToastrService,
              private router: Router){}

  ngOnInit(): void {

    this.subs.push(
      this.localService.buscarOperadoras().subscribe({
        next: (dados) => {

          this.loadingOperadoras = false

          if(dados?.status){

            this.operadoras = []

            if(dados?.data?.length){

              const operadoras = dados?.data

              operadoras.forEach((operadora, index) => {
                this.operadoras.push({
                  value: operadora?.chave,
                  label: operadora?.valor,
                  icon: operadora?.imagem,
                  atalho: index + 1,
                  ctrl: true
                })
              });

            } else {
              this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Nenhuma operadora está disponível para recarga no momento. Tente novamente e caso persista o erro, contate o Help Desk.')
            }
          } else {
            this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Nenhuma operadora está disponível para recarga no momento. Tente novamente e caso persista o erro, contate o Help Desk.')
          }
        }, error: () => {
          this.toastrService.mostrarToastrDanger('Nenhuma operadora está disponível para recarga no momento. Tente novamente e caso persista o erro, contate o Help Desk.')
        }
      })
    )

    this.subs.push(
      this.localService.buscarValoresRecarga().subscribe({
        next: (dados) => {

          this.loadingValoresRecargas = false

          if(dados?.status){
            if(dados?.data?.length){

              this.valoresRecarga = []

              let valoresRecarga = []
              if(dados?.data?.length){
                for(const valor of dados.data){
                  if(!isNaN(parseFloat(valor?.chave))){
                    valoresRecarga.push(parseFloat(valor?.chave))
                  }
                }
              }
              valoresRecarga = Array.from(new Set(valoresRecarga))

              valoresRecarga.forEach((recarga, index) => {
                this.valoresRecarga.push({
                  value: recarga,
                  label: `R$ ${recarga}`,
                  atalho: index + 1,
                  alt: true
                })
              });

            } else {
              this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Nenhuma valor de recarga está disponível no momento. Tente novamente e caso persista o erro, contate o Help Desk.')
            }
          } else {
            this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Nenhuma valor de recarga está disponível no momento. Tente novamente e caso persista o erro, contate o Help Desk.')
          }

        }, error: () => {
          this.toastrService.mostrarToastrDanger('Nenhuma valor de recarga está disponível no momento. Tente novamente e caso persista o erro, contate o Help Desk.')
        }
      })
    )

    this.formOperadora = this.formBuilder.group({
      operadora: [null, Validators.required],
      celular: [null, Validators.required],
      celular_confirmar: [null, Validators.required],
      valor: [null, Validators.required]
    })

  }

  ngOnDestroy(): void {
    if(this.subs?.length){
      for(const sub of this.subs){
        sub.unsubscribe()
      }
    }
  }

  cancelarCompra(): void {
    this.modalConfirmacaoService.abrirModalConfirmacao(
      'Cancelar recarga',
      'Deseja cancelar a recarga atual? Todos os dados serão perdidos',
      {
        icone: 'pi pi-info-circle',
        callbackAceitar: () => {
          this.router.navigate(['venda-mais', 'local', 'caixa', 'cliente']);
        }
      }
    )
  }

  gerarDadosPassoRecarga(): any {

    const dados = this.formOperadora?.getRawValue()
    dados['celular'] = dados?.celular?.replace(/_/g, '');
    dados['celular_confirmar'] = dados?.celular_confirmar?.replace(/_/g, '');
    dados['valor'] = dados?.valor?.value;

    return {
      recarga: dados,
      produtos: [
        {
          imagem: dados?.operadora?.icon,
          nm_produto: `Recarga ${ dados?.operadora?.label} - ${dados?.celular}`,
          quantidade: 1,
          preco: {
            vlr_fim: dados?.valor
          }
        }
      ]
    }
  }

  proximoPasso(): void {

    this.formOperadora.markAllAsTouched()

    if(this.formOperadora.valid){

      if(this.formOperadora?.get('celular')?.value != this.formOperadora?.get('celular_confirmar')?.value){
        this.toastrService.mostrarToastrDanger('Os números informados são diferentes. Corrija-os para prosseguir')
        return
      }

      const navigationExtras = {
        state: {
          data: this.gerarDadosPassoRecarga()
        }
      };

      this.router.navigate(['venda-mais', 'local', 'recarga', 'pagamento'], navigationExtras)
    } else {
      this.toastrService.mostrarToastrDanger('Informe todos os campos para prosseguir')
    }
  }

}
