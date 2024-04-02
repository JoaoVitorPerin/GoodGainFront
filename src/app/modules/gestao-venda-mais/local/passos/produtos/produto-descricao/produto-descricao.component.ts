import { PrecoComponent } from './../../../../../../shared/components/preco/preco.component';
import { itensCarrinho } from 'src/app/shared/models/itensCarrinho.model';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from "@angular/router";


@Component({
  selector: 'app-produto-descricao',
  standalone: true,
  imports: [
    PrecoComponent
  ],
  templateUrl: './produto-descricao.component.html',
  styleUrl: './produto-descricao.component.css'
})
export class ProdutoDescricaoComponent implements OnInit {

  @Input() produto: itensCarrinho

  tipo: string;

  constructor(private sanitizer: DomSanitizer,
              private router: Router){}

  ngOnInit(): void {
    this.tipo = this.router.url.split('/')[3]
  }

  sanitizeString(str: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(str)
  }

}
