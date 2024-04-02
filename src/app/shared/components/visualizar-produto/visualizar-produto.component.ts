import { PrecoComponent } from './../preco/preco.component';
import { ModalService } from 'src/app/shared/components/modal/modal.service';
import { VisualizarProdutoService } from './visualizar-produto.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: 'app-visualizar-produto',
  standalone: true,
  imports: [
    PrecoComponent
  ],
  templateUrl: './visualizar-produto.component.html',
  styleUrl: './visualizar-produto.component.css'
})
export class VisualizarProdutoComponent implements OnInit, OnDestroy {

  @ViewChild('modalVisualizarProduto') modalVisualizarProduto: TemplateRef<any>

  subs: Subscription[] = []

  produto: any

  constructor(private visualizarProdutoService: VisualizarProdutoService,
              private modalService: ModalService,
              private sanitizer: DomSanitizer){}

  ngOnInit(): void {
    this.subs.push(
      this.visualizarProdutoService.visualizarProduto$.subscribe((produto) => {

        if(!produto)
          return

        this.produto = produto

        const botoes = [
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

        this.modalService.abrirModal('Detalhes', this.modalVisualizarProduto, botoes)

      })
    )
  }

  ngOnDestroy(): void {
    if(this.subs?.length){
      for(const sub of this.subs){
        sub.unsubscribe()
      }
    }
  }

  sanitizeString(str: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(str)
  }

}
