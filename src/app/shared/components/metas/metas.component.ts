import { ElementoFocoDirective } from '../../directives/elemento-foco.directive';
import { AtalhoEventoDirective } from 'src/app/shared/directives/atalho-evento.directive';
import { ModalModule } from 'src/app/shared/components/modal/modal.module';
import { ModalService } from 'src/app/shared/components/modal/modal.service';
import { LocalService } from 'src/app/modules/gestao-venda-mais/local/local.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import * as dayjs from 'dayjs'
import { MetaDiariaComponent } from './meta-diaria/meta-diaria.component';
import { MetaMensalComponent } from './meta-mensal/meta-mensal.component';

@Component({
  selector: 'app-pre-metas',
  standalone: true,
  imports: [
    ModalModule,
    AtalhoEventoDirective,
    ElementoFocoDirective,
    MetaDiariaComponent,
    MetaMensalComponent
  ],
  templateUrl: './metas.component.html',
  styleUrl: './metas.component.css',
})
export class MetasComponent implements OnInit, OnDestroy {

  @ViewChild('modalMetas') modalMetas: TemplateRef<any>

  subs: Subscription[] = []

  dadosMetasDiaria: any;
  dadosMetasMensal: any;

  dayjs = dayjs

  constructor(private localService: LocalService,
              private modalService: ModalService){}

  ngOnInit(): void {

    this.subs.push(
      this.localService.dadosMetas$.subscribe(dados => {
        this.dadosMetasDiaria = dados?.dadosMetasDiaria ?? [1];
        this.dadosMetasMensal = dados?.dadosMetasMensal ?? [1];
        this.visualizarMetas()
      })
    )
  }

  ngOnDestroy(): void {
    if(this.subs?.length){
      for(const subs of this.subs){
        subs.unsubscribe()
      }
    }
  }

  visualizarMetas(): void {
    const botoes = [
      // {
      //   label: 'Confirmar (Shift + Enter)',
      //   color: 'primary',
      //   atalho: 'Enter',
      //   shift: true,
      //   onClick: () => {
      //     this.modalService.fecharModal()
      //   },
      // },
      {
        label: 'Fechar (Shift + Esc)',
        color: 'secondary',
        atalho: 'Escape',
        shift: true,
        onClick: () => {
          this.modalService.fecharModal()
        },
      }
    ]

    this.modalService.fecharModal(); // Fechar modal aberta anteriormente
    this.modalService.abrirModal('Metas', this.modalMetas, botoes, {larguraDesktop: 75})
  }
 
}
