import { SkeletonModule } from 'primeng/skeleton';
import { PesquisaProdutoComponent } from './../../../../../shared/components/pesquisa-produto/pesquisa-produto.component';
import { ElementoFocoDirective } from './../../../../../shared/directives/elemento-foco.directive';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { ProdutoDescricaoComponent } from './produto-descricao/produto-descricao.component';
import { LocalService } from './../../local.service';
import { ScannerComponent } from 'src/app/shared/components/scanner/scanner.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CestaComponent } from "../../frames/cesta-caixa/cesta.component";
import { itensCarrinho } from "src/app/shared/models/itensCarrinho.model";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { FormModule } from "src/app/shared/components/form/form.module";
import { Router } from "@angular/router";
import { DropdownModule } from "primeng/dropdown";
import { CarrosselProdutosComponent } from "src/app/shared/components/carrossel-produtos/carrossel-produtos.component";

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CestaComponent,
    ScannerComponent,
    ProdutoDescricaoComponent,
    CardModule,
    ButtonModule,
    FormModule,
    DropdownModule,
    ElementoFocoDirective,
    PesquisaProdutoComponent,
    SkeletonModule,
    CarrosselProdutosComponent
  ],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.css'
})
export class ProdutosComponent implements OnInit, OnDestroy {

  scanner: string

  produtos: Array<itensCarrinho> | [] = [];
  produtosExclusao: Array<itensCarrinho> | [] = [];
  produtosPesquisados: Array<itensCarrinho> | [] = [];

  preVendas: Array<any> | [] = [];

  ultimoProdutoBipado: itensCarrinho;

  formPesquisa: FormGroup;

  modoExclusao: boolean

  subs: Subscription[] = []

  dadosNavegacao = window.history?.state?.data

  tipo: string

  clienteAnonimo: boolean = false

  cliente: string

  loadingDadosProdutosSugeridos: boolean = false

  componentes: Array<any> = []

  constructor(private localService: LocalService,
              private toastrService: ToastrService,
              private formBuilder: FormBuilder,
              private router: Router){}

  ngOnInit(): void {

    console.log(this.dadosNavegacao);

    if(!this.dadosNavegacao)
      this.router.navigate(['venda-mais', 'local', 'caixa', 'cliente'])

    if(this.dadosNavegacao?.cliente?.cliente)
      this.cliente = this.dadosNavegacao?.cliente?.cliente

    if(this.dadosNavegacao?.pre_vendas?.length) {
      this.preVendas = this.dadosNavegacao?.pre_vendas
      this.enviarProdutosPreVendaParaACesta(this.preVendas)
    }

    this.tipo = this.router.url.split('/')[3]

    this.formPesquisa = this.formBuilder.group({
      ean: [null],
      pesquisa: [null]
    })

    this.subs.push(
      this.localService.toggleModoExclusao$.subscribe(decisao => {
        this.habilitarModoExclusao(decisao)
      })
    )

    this.subs.push(
      this.localService.decisaoModoExclusao$.subscribe(decisao => {
        this.confirmarExclusao(decisao)
      })
    )

    this.subs.push(
      this.localService.proximoPasso$.subscribe(() => {
        if(this.produtos?.length){
          this.proximoPasso()
        } else {
          this.toastrService.mostrarToastrDanger('Bipe pelo menos um produto para prosseguir')
        }
      })
    )

    if(this.tipo === 'pre-venda'){
      this.loadingDadosProdutosSugeridos = true

      const dados = {
        cliente: this.cliente
      }

      this.subs.push(
        this.localService.buscarComponentesProdutosSugeridos(dados).subscribe({
          next: (dados) => {

            if(dados?.status){
              if(dados?.componentes?.length)
                this.componentes = dados?.componentes
            }

            setTimeout(() => {
              this.loadingDadosProdutosSugeridos = false
            }, 3500);

          }, error: () => {
            this.loadingDadosProdutosSugeridos = false
          }
        })
      )
    }

  }

  ngOnDestroy(): void {
    if(this.subs?.length){
      for(const subs of this.subs){
        subs.unsubscribe()
      }
    }
  }

  pesquisarProduto(): void {

    if(!this.formPesquisa?.get('ean')?.value){
      this.produtosPesquisados = []
      return
    }

    /*
    * Regex para validar se a string digitada é um EAN
    */
    const isEan = /^[a-zA-Z0-9][0-9]{7,}$/;

    /*
    * Regex para validar se a string digitada é um cód. de produto
    */
    const isCdProduto =  /^[0-9]{1,7}$/;

    const valorPesquisado = this.formPesquisa?.get('ean')?.value?.replace(/_/g, '')

    if(isEan.test(valorPesquisado)){
      this.scanner = valorPesquisado
      this.produtoBipado()
      this.formPesquisa?.get('ean')?.setValue('')
    } else if (isCdProduto.test(valorPesquisado)){
      const dados = {
        produto_id: valorPesquisado
      }
      this.buscarProdutoPesquisado(dados)
    } else {
      const dados = {
        nm_produto: valorPesquisado
      }
      this.buscarProdutoPesquisado(dados)
    }
  }

  buscarProdutoPesquisado(dados): void {

    this.localService.buscarProdutos(dados).subscribe({
      next: (dados) => {
        if(dados.status){
          if(dados?.data?.produtos?.length){

            this.produtosPesquisados = []

            const produtosEncontrados = dados?.data?.produtos

            produtosEncontrados.map((produto) => {
              if(produto?.precos?.length)
                produto['preco'] = produto?.precos[0]
              if(produto?.eans?.length)
                produto['ean'] = produto?.eans[0]
            })

            this.produtosPesquisados = produtosEncontrados

            if(this.produtosPesquisados?.length > 6)
              this.produtosPesquisados =  this.produtosPesquisados.splice(0, 6)

          }
        } else {
          this.toastrService.mostrarToastrDanger('Nenhum produto localizado. Confira ou embalagem ou digite o EAN manualmente')
        }
      }, error: () => {
        this.toastrService.mostrarToastrDanger('Nenhum produto localizado. Confira ou embalagem ou digite o EAN manualmente')
      }
    })
  }

  buscarProduto(): void {

    const dados = {
      ean: this.scanner
    }

    this.localService.buscarProdutos(dados).subscribe({
      next: (dados) => {

        if(dados.status){
          if(dados?.data?.produtos?.length){

            const produtosEncontrados = dados?.data?.produtos

            produtosEncontrados.map((produto) => {
              if(produto?.precos?.length)
                produto['preco'] = produto?.precos[0]
              if(produto?.eans?.length)
                produto['ean'] = produto?.eans.some((ean) => ean == this.scanner) ? this.scanner : ''
            })

            const produtoBipado: itensCarrinho = produtosEncontrados.find((produto) => {
              return produto?.eans?.length ? produto?.eans.some((ean) => ean == this.scanner) : false
            })

            if(produtoBipado && Object.keys(produtoBipado)?.length){

              this.ultimoProdutoBipado = produtoBipado

              const produtoIgualNoCarrinho = this.produtos.some((produto) => (produto['ean'] ? produto['ean'] : '') == this.ultimoProdutoBipado?.ean)

              if(!produtoIgualNoCarrinho){
                this.adicionarProdutoCarrinho(this.produtos, this.ultimoProdutoBipado)
              } else {
                this.adicionarQuantidadeProdutoCarrinho(this.produtos, this.ultimoProdutoBipado)
              }

            } else {
              this.toastrService.mostrarToastrDanger('Nenhum produto localizado')
            }
          }
        } else {
          this.toastrService.mostrarToastrDanger('Nenhum produto localizado')
        }

        this.scanner = ''

      }, error: () => {
        this.toastrService.mostrarToastrDanger('Nenhum produto localizado')
        this.scanner = ''
      }
    })
  }

  removerProduto(): void {

    if(!this.produtosExclusao?.length){
      this.modoExclusao = false;
      return
    }

    const produtoEstaNaCesta = this.produtosExclusao.some((produto) => (produto['ean'] ? parseInt(produto['ean']) : '') == this.scanner)

    if(produtoEstaNaCesta){
      this.produtosExclusao.map((produto, index) => {

        if((produto['ean'] ? parseInt(produto['ean']) : '') == this.scanner){

          if(isNaN(produto.quantidade_removida))
              produto.quantidade_removida = 0

          produto.quantidade_removida = +produto.quantidade_removida + 1

          if(+produto?.quantidade == +produto.quantidade_removida){
            this.produtosExclusao.splice(index, 1)
            return
          }
        }
      })

      this.scanner = ''

    } else {
      this.toastrService.mostrarToastrDanger('Você está no modo de exclusão e o item bipado não está na cesta do cliente')
    }

  }

  produtoBipado(): void {
    if(!this.modoExclusao){
      this.buscarProduto()
    } else {
      this.removerProduto()
    }
  }

  adicionarProdutoCesta(produto): void {

    this.ultimoProdutoBipado = produto
    const produtoIgualNoCarrinho = this.produtos.some((produto) => (produto['ean'] ? produto['ean'] : '') == this.ultimoProdutoBipado?.ean && !produto['is_pre_venda'])
    if(!produtoIgualNoCarrinho){
      this.adicionarProdutoCarrinho(this.produtos, this.ultimoProdutoBipado)
    } else {
      this.adicionarQuantidadeProdutoCarrinho(this.produtos, this.ultimoProdutoBipado)
    }
  }

  adicionarProdutoCarrinho(produtos: Array<itensCarrinho> | [], ultimoProdutoBipado: itensCarrinho): void {

    if(!ultimoProdutoBipado?.ean)
      return

    ultimoProdutoBipado.quantidade = 1

    produtos = [
      ...produtos,
      ultimoProdutoBipado
    ]

    this.produtos = produtos

  }

  adicionarQuantidadeProdutoCarrinho(produtos: Array<itensCarrinho> | [], ultimoProdutoBipado: itensCarrinho): void {

    if(!ultimoProdutoBipado?.ean)
      return

    produtos?.map((produto) => {
      if(produto?.ean == ultimoProdutoBipado?.ean){
        produto.quantidade += 1
      }
    })

    this.produtos = produtos

  }

  habilitarModoExclusao(habilitado): void {

    if(this.produtos?.length){
      this.produtos?.map((produto) => {
        if(produto.quantidade_removida)
          produto.quantidade_removida = 0
      })
    }

    this.produtosExclusao = [...this.produtos]

    this.modoExclusao = habilitado
  }

  confirmarExclusao(confirmado: boolean): void {

    if(confirmado){
      if(this.produtosExclusao?.length){
        this.produtosExclusao?.map(produto => {
          if(isNaN(produto.quantidade_removida))
              produto.quantidade_removida = 0
          produto.quantidade = +produto?.quantidade - +produto.quantidade_removida
        })
      }

      this.produtos = this.produtosExclusao
      this.modoExclusao = false;
    }
  }

  enviarProdutosPreVendaParaACesta(preVendas: Array<any>): void {

    let produtos: Array<itensCarrinho> = []

    for(let preVenda of preVendas){
      if(preVenda?.produtos?.length){
        for(let produto of preVenda?.produtos){
          produto['is_pre_venda'] = true
          if(produto?.eans?.length)
            produto['ean'] = produto?.eans[0]
          produtos.push(produto)
        }
      }
    }

    this.produtos = [
      ...produtos,
      ...this.produtos
    ]

  }

  gerarDadosPassoProdutos(): any {
    return {
      ...this.dadosNavegacao,
      produtos: this.produtos
    }
  }

  proximoPasso(): void {
    const navigationExtras = {
      state: {
        data: this.gerarDadosPassoProdutos()
      }
    };
    this.router.navigate(['venda-mais', 'local', 'caixa', 'pagamento'], navigationExtras)
  }

}
