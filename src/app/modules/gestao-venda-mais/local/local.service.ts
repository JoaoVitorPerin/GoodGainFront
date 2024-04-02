import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HeaderService } from 'src/app/core/services/header.service';

@Injectable({
  providedIn: 'root',
})
export class LocalService {

  private readonly API_BACK = environment.API_BACK;
  private readonly API_ONLINE = environment.API_ONLINE;

  data: any;

  produtos: Array<any> = [];

  /*
   ** Subject que irá indicar aos ouvintes se o modo de exclusão de itens da cesta foi habilitado ou desabilitado
   */
  private toggleModoExclusao = new Subject<boolean>();
  toggleModoExclusao$ = this.toggleModoExclusao.asObservable();

  /*
   ** Subject que irá indicar aos ouvintes se o modo de exclusão foi confirmado ou cancelado
   */
  private decisaoModoExclusao = new Subject<boolean>();
  decisaoModoExclusao$ = this.decisaoModoExclusao.asObservable();

  /*
   ** Subject que irá indicar que o próximo passo foi solicitado
   */
  private proximoPasso = new Subject<boolean>();
  proximoPasso$ = this.proximoPasso.asObservable();

  /*
   ** Subject que irá indicar que os itens do menu devem ser atualizados
   */
  private menu = new Subject<boolean>();
  menu$ = this.menu.asObservable();

  /*
   ** Subject que irá indicar que o valor do caixa deve ser atualizado no asidebar
   */
  private vlrCaixa = new Subject<boolean>();
  vlrCaixa$ = this.vlrCaixa.asObservable();

  /*
   ** Subject que irá indicar que as metas do funcionário devem ser atualizadas
   */
  private metas = new Subject<boolean>();
  metas$ = this.metas.asObservable();

  /*
   ** Subject que irá atualizar o valor restante a ser pago que será exibido na cesta
   */
  private valorRestante = new Subject<number>();
  valorRestante$ = this.valorRestante.asObservable();

  /*
   ** Subject que irá enviar os dados de metas para o componente responsável e abrir a modal de visualização
   */
  private dadosMetas = new Subject<any>();
  dadosMetas$ = this.dadosMetas.asObservable();

  /*
   ** Subject que irá enviar os dados de pré-venda para o componente responsável e abrir a modal de visualização
   */
  private dadosPreVenda = new Subject<any>();
  dadosPreVenda$ = this.dadosPreVenda.asObservable();

  /*
   ** Subject que irá notificar os componentes ouvintes que uma pré-venda foi enviada para a cesta
   */
  private preVendaSelecionada = new Subject<any>();
  preVendaSelecionada$ = this.preVendaSelecionada.asObservable();

  constructor(private http: HttpClient, private headerService: HeaderService) {}

  atualizarToggleModoExclusao(decisao: boolean) {
    this.toggleModoExclusao.next(decisao);
  }

  atualizarDecisaoModoExclusao(decisao: boolean) {
    this.decisaoModoExclusao.next(decisao);
  }

  atualizarProximoPasso(decisao: boolean) {
    this.proximoPasso.next(decisao);
  }

  atualizarMenu(decisao: boolean) {
    this.menu.next(decisao);
  }

  atualizarValorCaixa(decisao: boolean) {
    this.vlrCaixa.next(decisao);
  }

  atualizarMetas(decisao: boolean) {
    this.metas.next(decisao);
  }

  atualizarValorRestante(valor: number) {
    this.valorRestante.next(valor);
  }

  atualizarDadosMetas(dados: any) {
    this.dadosMetas.next(dados);
  }

  atualizarDadosPreVenda(dados: any) {
    this.dadosPreVenda.next(dados);
  }

  atualizarPreVendaSelecionada(dados: any) {
    this.preVendaSelecionada.next(dados);
  }

  login(dados): Observable<any> {
    this.data = {
      ...dados,
    };

    return this.http.post<any>(`${this.API_BACK}login`, this.data, {
      headers: this.headerService.getHeader(),
    });
  }

  buscarCliente(dados): Observable<any> {
    this.data = {
      ...dados,
    };

    return this.http.get<any>(`${this.API_BACK}cliente/buscar`, {
      headers: this.headerService.getHeader(),
      params: this.data,
    });
  }

  buscarClienteScore(dados): Observable<any> {

    return of({
      status: true,
      score: 72,
      nivel: "Comum",
      cor: "warning"
    })

    this.data = {
      ...dados,
    };

    return this.http.get<any>(`${this.API_ONLINE}cliente/buscar/score`, {
      headers: this.headerService.getHeader(),
      params: this.data,
    });
  }

  buscarDadosOnlineCliente(dados): Observable<any> {

    return of({
      status: true,
      cliente: {
        celular: "(41) 9 9688-3936",
        email: "fulano@goodgain.com.br",
        dat_nasc: "1998-06-19",
        sexo: "M",
      }
    })

    this.data = {
      ...dados,
    };

    return this.http.get<any>(`${this.API_ONLINE}cliente/buscar/extras`, {
      headers: this.headerService.getHeader(),
      params: this.data,
    });
  }

  cadastrarCliente(dados): Observable<any> {
    this.data = {
      ...dados,
    };

    return this.http.post<any>(`${this.API_BACK}cliente/cadastrar`, this.data, {
      headers: this.headerService.getHeader(),
    });
  }

  buscarEnderecoPrincipal(dados): Observable<any> {

    return of({
      status: true,
      endereco: {
          "cep__cep_form": "80.620-200",
          "apelido": "Trabalho",
          "is_principal": true,
          "endereco": "Avenida Água Verde",
          "bairro": "Água Verde",
          "numero": "1413",
          "complemento": "10° andar",
          "ponto_referencia": null,
          "id": 12183188,
          "cep__bairro_cep": null,
          "cep__endereco_cep": "Água Verde",
          "cep__municipio__nome": "Curitiba",
          "cep__municipio__uf__nm_abrev": "PR"
      }
    })

    this.data = {
      ...dados,
    };

    return this.http.post<any>(`${this.API_ONLINE}endereco/buscar`, this.data, {
      headers: this.headerService.getHeader(),
    });
  }

  salvarEnderecoPrincipal(dados): Observable<any> {

    return of({
      status: true,
    })

    this.data = {
      ...dados,
    };

    return this.http.post<any>(`${this.API_ONLINE}endereco/salvar`, this.data, {
      headers: this.headerService.getHeader(),
    });
  }

  buscarConvenios(dados): Observable<any> {

    return of({
      status: true,
      convenios: [
        {
            "id": 2810540,
            "clube_id": "4567460",
            "saldo": null,
            "limite": null,
            "vlr_proxima_fatura": null,
            "clube_nome": "USIMEC                        "
        },
        {
            "id": 2810541,
            "clube_id": "4567465",
            "saldo": null,
            "limite": null,
            "vlr_proxima_fatura": null,
            "clube_nome": "VIA ARTE                      "
        }
      ]
    })

    this.data = {
      ...dados,
    };

    return this.http.post<any>(`${this.API_ONLINE}convenios/buscar`, this.data, {
      headers: this.headerService.getHeader(),
    });
  }

  buscarParcerias(dados): Observable<any> {

    return of({
      status: true,
      parcerias: [
        {
            "pk": "unimed_pr",
            "imagem": "clubes/default.png",
            "clube_nome": "Unimed",
            "is_ativo": false
        },
        {
            "pk": "unimed",
            "imagem": "clubes/default.png",
            "clube_nome": "Copel",
            "is_ativo": false
        }
      ]
    })

    this.data = {
      ...dados,
    };

    return this.http.post<any>(`${this.API_ONLINE}parcerias/buscar`, this.data, {
      headers: this.headerService.getHeader(),
    });
  }

  buscarProdutos(dados): Observable<any> {
    this.data = {
      ...dados,
    };

    return this.http.get<any>(`${this.API_BACK}produto/pesquisar`, {
      headers: this.headerService.getHeader(),
      params: this.data,
    });
  }

  buscarProdutosPorCodigo(dados): Observable<any> {
    this.data = {
      ...dados,
    };

    return this.http.get<any>(`${this.API_BACK}produto/pesquisar`, {
      headers: this.headerService.getHeader(),
      params: this.data,
    });
  }

  buscarProdutosPorNome(dados): Observable<any> {
    this.data = {
      ...dados,
    };

    return this.http.get<any>(`${this.API_BACK}produto/pesquisar`, {
      headers: this.headerService.getHeader(),
      params: this.data,
    });
  }

  buscarFormasPagamento(): Observable<any> {
    return this.http.get<any>(`${this.API_BACK}pagamento/buscar`, {
      headers: this.headerService.getHeader(),
    });
  }

  buscarOperadoras(): Observable<any> {
    return this.http.get<any>(`${this.API_BACK}terminal/operadoras`, {
      headers: this.headerService.getHeader(),
    });
  }

  buscarValoresRecarga(): Observable<any> {
    return this.http.get<any>(`${this.API_BACK}pagamento/recargas`, {
      headers: this.headerService.getHeader(),
    });
  }

  buscarUsuarioLogado(): Observable<any> {
    return of({
      nome: 'Fulano Beltrano',
      cargo: 'Funcionário',
      cd_filial: '014',
      unidade: '2',
      limite_sangria: 500,
    });
    return this.http.get<any>(`${this.API_BACK}usuario_logado`);
  }

  buscarPreVendas(dados): Observable<any> {
    return of({
      status: true,
      cliente: '094.637.669-79',
      pre_vendas: [
        {
          id: 54,
          codigo: 37,
          dat_criacao: '2024-02-26 18:15:20',
          produtos: [
            {
              produto_id: '12345',
              nm_produto: 'Coca Cola | Teste',
              nm_marca: 'Colgate',
              eans: ['7894900700015', '2321321'],
              imagem:
                'https://w7.pngwing.com/pngs/840/560/png-transparent-santa-claus-coca-cola-fizzy-drinks-christmas-coca-cola-vintage-fictional-character-cola-haddon-sundblom.png',
              descricao: null,
              preco: {
                vlr_ini: 5.65,
                vlr_fim: 4.5,
              },
              quantidade: 3,
            },
          ],
        },
        {
          id: 55,
          codigo: 38,
          dat_criacao: '2024-02-27 09:20:20',
          produtos: [
            {
              produto_id: '12345',
              nm_produto: 'Coca Cola | Teste',
              nm_marca: 'Colgate',
              eans: ['7894900700015', '2321321'],
              imagem:
                'https://w7.pngwing.com/pngs/840/560/png-transparent-santa-claus-coca-cola-fizzy-drinks-christmas-coca-cola-vintage-fictional-character-cola-haddon-sundblom.png',
              descricao: null,
              preco: {
                vlr_ini: 5.65,
                vlr_fim: 4.5,
              },
              quantidade: 5,
            },
          ],
        },
      ],
    });

    this.data = {
      ...dados,
    };

    return this.http.get<any>(`${this.API_BACK}prevenda/buscar`, {
      headers: this.headerService.getHeader(),
      params: this.data,
    });
  }

  buscarComponentes(): Observable<any> {
    return of({
      status: true,
      componentes: [
        {
          grid: 'col-12 md:col-6',
          tipo: 'imagem',
          label: '',
          configuracao: {
            tipo: 'pre-venda',
            url_desktop:
              'https://www.farmaciasnissei.com.br/media/estrutura/logo/Banner%20Ver%C3%A3o%20FEV%20Home%20-%201244X400.webp',
            url_mobile:
              'https://www.farmaciasnissei.com.br/media/estrutura/logo/Banner%20Ver%C3%A3o%20FEV%20Home%20-%20360x300.webp',
          },
        },
        {
          grid: 'col-12 md:col-4',
          tipo: 'imagem',
          label: '',
          configuracao: {
            tipo: 'pre-venda',
            url_desktop:
              'https://www.farmaciasnissei.com.br/media/estrutura/minibanners/B%20C%20Ofertas%20Farmacinha%20Desk.webp',
            url_mobile:
              'https://www.farmaciasnissei.com.br/media/estrutura/minibanners/B-C-Ofertas-Farmacinha-Mob.webp',
          },
        },
        {
          grid: 'col-12 md:col-2',
          tipo: 'imagem',
          label: '',
          configuracao: {
            tipo: 'pre-venda',
            url_desktop:
              'https://www.farmaciasnissei.com.br/media/estrutura/minibanners/B-C-Ofertas-Mam%C3%A3e-e-Desk.webp',
            url_mobile:
              'https://www.farmaciasnissei.com.br/media/estrutura/minibanners/B%20C%20Ofertas%20Cuide-seMob.webp',
          },
        },
        {
          grid: 'col-12 md:col-6',
          tipo: 'carrossel-produtos',
          label: 'Encarte',
          configuracao: {
            showIndicators: false,
            showNavigators: false,
            qtd_desktop: 3,
            qtd_mobile: 2,
            produtos: [
              {
                produto_id: '645821',
                ean: '07894900700015',
                nome: 'Refrigerante Coca-Cola Sem Açúcar Lata 350ml',
                imagem:
                  'https://vendamais.nisseilabs.com.br/media/produtos/645821_1200x1200_enPI8Nc.webp',
                descricao:
                  '<p><span style="font-family: Arial;"><b></b></span><font face="Arial"><b>Refrigerante Coca-Cola Sem Açúcar</b><br></font></p><p><font face="Arial"><br></font></p><p><font face="Arial">A Coca-Cola Sem Açúcar é um refrigerante que não contém calorias! Com certeza você já se perguntou: Então, de onde vem aquele gostinho doce? A Coca-Cola Zero é produzida especialmente com adoçantes para manter o delicioso sabor de Coca-Cola porém com 0% açucar! Toda Coca-Cola é produzida especialmente para manter sempre a qualidade do melhor sabor de refrigerante! Uma garrafa de Coca-Cola é perfeita para compartilhar os melhores momentos da vida com amigos e familiares! Não deixe de conferir todos os produtos Coca-Cola nas <b>Farmácias Nissei</b>.</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Ingredientes:&nbsp;</b></font></p><p><font face="Arial">Água gaseificada, extrato de noz de cola, cafeína, aroma natural, corante caramelo IV, acidulante ácido fosfórico, edulcorantes ciclamato de sódio (27 mg), acesulfame de potássio (15 mg) e aspartame (12 mg) por 100 ml, conservador benzoato de sódio, regulador de acidez citrato de sódio. Contém Fenilalanina.&nbsp;</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Advertência:&nbsp;&nbsp;</b></font></p><p><font face="Arial">Conservar em local fresco, seco e ao abrigo de luz.&nbsp;</font></p><p><font face="Arial">Antes de consumir verifique a data de validade.</font></p><p><font face="Arial">Não consumir caso a embalagem esteja violada.&nbsp;</font></p>',
                tipo_produto: null,
                marca: 'COCA COLA',
                preco: {
                  filial: 23,
                  produto_id: '645821',
                  lista_id: 170,
                  lista_nome: 'preco_base_loja_023',
                  lista_clube: 'filial',
                  vlr_ini: '5.50',
                  produto_nome: 'Refrigerante Coca-Cola Sem Açúcar Lata 350ml',
                  produto_selo: 'produtos/selos/selo_semana[1].webp',
                  produto_is_controlado: false,
                  produto_is_disponivel: true,
                  desconto_id: 52047997,
                  qtd_ini_desc: 2,
                  qtd_fim_desc: null,
                  desconto_valor: '2.50',
                  desconto_percentual: null,
                  desconto_valor_referencia: null,
                  desconto_produto_brinde: null,
                  dat_fim_timer: null,
                  qtd_restante: null,
                  desconto_tipo_id: 'agrupadoJuntoValor',
                  desconto_cor: 'ee3a41',
                  desconto_cor_hover: 'd7343b',
                  desconto_botao_html:
                    '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                  desconto_botao_padrao_html: 'Comprar',
                  desconto_html:
                    '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                  desconto_agrupamento: 'maispormenos',
                  desconto_tipo: 'valor',
                  desconto_is_label: false,
                  desconto_imagem:
                    'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                  desconto_is_sempre_invisivel: false,
                  progressao_quantidade: null,
                  progressao_valor_desconto: null,
                  progressao_percentual_desconto: null,
                  progressao_valor_final: null,
                  progressao_qtd_limite: null,
                  valor_referencia_inicial: '5.50',
                  vlr_fim: '3.00',
                  referencia: 3,
                  is_desconto: true,
                  dat_ini_lista: '1900-01-01',
                  dat_fim_lista: '2999-12-31',
                  dat_ini_preco: null,
                  dat_fim_preco: null,
                  dat_ini_desconto: '2024-02-01T03:00:00Z',
                  dat_fim_desconto: '2024-03-01T03:00:00Z',
                  status_lista: true,
                  status_preco: true,
                  status_relacao: true,
                  status_desconto: true,
                  status_progressao: null,
                },
              },
              {
                produto_id: '122085',
                ean: '07894900011715',
                nome: 'Refrigerante Coca-Cola Pet 1 Litro',
                descricao:
                  '<p><span style="font-family: Arial;"><b></b></span><font face="Arial"><b>Refrigerante Coca-Cola</b><br></font></p><p><font face="Arial"><br></font></p><p><font face="Arial">Com sabor inconfundível e único, a Coca-Cola é o refrigerante mais tradicional e consumido no mundo inteiro! Toda Coca-Cola é produzida especialmente para manter sempre a qualidade do melhor sabor de refrigerante! Uma garrafa de Coca-Cola é perfeita para compartilhar os melhores momentos da vida com amigos e familiares! Não deixe de conferir todos os produtos Coca-Cola nas <b>Farmácias Nissei</b>.</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Ingredientes:&nbsp;</b></font></p><p><font face="Arial">Água gaseificada, açúcar, extrato de noz de cola, cafeína, corante caramelo IV, acidulante ácido fosfórico e aroma natural.</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Advertência:</b></font></p><p><font face="Arial">Conservar em local fresco, seco e ao abrigo de luz.</font></p><p><font face="Arial">Antes de consumir verifique a data de validade.</font></p><p><font face="Arial">Não consumir caso a embalagem esteja violada.</font></p><p><font face="Arial"></font></p>',
                imagem:
                  'https://vendamais.nisseilabs.com.br/media/produtos/122085_1200x1200.jpg',
                tipo_produto: null,
                marca: 'COCA COLA',
                preco: {
                  vlr_fim: 8.95,
                },
              },
              {
                produto_id: '29070',
                ean: '07622210673831',
                nome: 'Chocolate Lacta Ao Leite 80g',
                descricao:
                  '<p><span style="font-family: Arial;"><b></b></span><font face="Arial"><b>Chocolate Lacta Ao Leite</b><br></font></p><p><font face="Arial"><br></font></p><p><font face="Arial">Acrescente um toque de sabor todo especial ao seu dia a dia com a saborosíssima Barra de Chocolate Ao Leite Lacta 90g. Elaborada com ingredientes selecionados é extremamente saborosos. É a escolha perfeita para alegrar o seu dia. Aproveite e adquira já o seu nas <b>Farmácias Nissei</b>.</font></p>',
                imagem:
                  'https://vendamais.nisseilabs.com.br/media/produtos/29070_1200x1200_1rOyNfn.webp',
                tipo_produto: null,
                marca: 'LACTA',
                preco: {
                  filial: 23,
                  produto_id: '29070',
                  lista_id: 170,
                  lista_nome: 'preco_base_loja_023',
                  lista_clube: 'filial',
                  vlr_ini: '6.95',
                  produto_nome: 'Chocolate Lacta Ao Leite 80g',
                  produto_selo: 'produtos/selos/selo_semana[1].webp',
                  produto_is_controlado: false,
                  produto_is_disponivel: true,
                  desconto_id: 49573031,
                  qtd_ini_desc: 2,
                  qtd_fim_desc: null,
                  desconto_valor: '2.20',
                  desconto_percentual: null,
                  desconto_valor_referencia: null,
                  desconto_produto_brinde: null,
                  dat_fim_timer: null,
                  qtd_restante: null,
                  desconto_tipo_id: 'agrupadoJuntoValor',
                  desconto_cor: 'ee3a41',
                  desconto_cor_hover: 'd7343b',
                  desconto_botao_html:
                    '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                  desconto_botao_padrao_html: 'Comprar',
                  desconto_html:
                    '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                  desconto_agrupamento: 'maispormenos',
                  desconto_tipo: 'valor',
                  desconto_is_label: false,
                  desconto_imagem:
                    'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                  desconto_is_sempre_invisivel: false,
                  progressao_quantidade: null,
                  progressao_valor_desconto: null,
                  progressao_percentual_desconto: null,
                  progressao_valor_final: null,
                  progressao_qtd_limite: null,
                  valor_referencia_inicial: '6.95',
                  vlr_fim: '4.75',
                  referencia: 4.75,
                  is_desconto: true,
                  dat_ini_lista: '1900-01-01',
                  dat_fim_lista: '2999-12-31',
                  dat_ini_preco: null,
                  dat_fim_preco: null,
                  dat_ini_desconto: '2024-02-01T03:00:00Z',
                  dat_fim_desconto: '2024-03-01T03:00:00Z',
                  status_lista: true,
                  status_preco: true,
                  status_relacao: true,
                  status_desconto: true,
                  status_progressao: null,
                },
              },
              {
                produto_id: '54354',
                ean: '070847022305',
                nome: 'Energético Monster Absolutely Zero 473ml',
                descricao: '',
                imagem:
                  'https://vendamais.nisseilabs.com.br/media/produtos/54354_200x200_6yYvjEd.jpg',
                tipo_produto: null,
                marca: 'MONSTER',
                preco: {
                  clube_id: 'publico',
                  produto_id: '54354',
                  produtopreco_id: 11588,
                  is_disponivel: true,
                  produto_url: 'energetico-monster-absolutely-zero-473ml',
                  produto_tipo: null,
                  vlr_ini: '9.95',
                  vlr_fim: '7.95',
                  vlr_fim_somado: 23.85,
                  filial_id: null,
                  is_desc: true,
                  desconto_id: 49440780,
                  desconto_nm_descritivo: 'Leve Mais por Menos',
                  dat_fim_timer: '',
                  qtd_restante: null,
                  descontoprodutopreco_id: 55791986,
                  is_desconto_invisivel: null,
                  imagem_selo: null,
                  tipo_desc: 'agrupadoJuntoValor',
                  imagem_desc:
                    'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                  is_label_desc: false,
                  cor_desc: 'ee3a41',
                  cor_hover_desc: 'd7343b',
                  descricao_html:
                    '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                  descricao_botao_html:
                    '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                  descricao_botao_padrao_html: 'Comprar',
                  per_desc: '20.10',
                  vlr_desc: '2.00',
                  qtd_ini_desc: 3,
                  qtd_fim_desc: null,
                  dat_ini_desc: '2024-02-01 03:00:00+00:00',
                  dat_fim_desc: '2024-03-01 03:00:00+00:00',
                  cd_produto_final_id: null,
                  cd_produto_final_nome: null,
                  cd_produto_final_url: null,
                  referencia: 7.95,
                  hash: 'NTQzNTRfXzExNTg4X181NTc5MTk4Ng==',
                  tipo_clube: 'clube',
                  is_retencao_receita: false,
                  is_controlado: false,
                  qtd_limite: null,
                  is_funcionario: true,
                  produto_is_funcionario: false,
                },
              },
            ],
          },
        },
        {
          grid: 'col-12 md:col-4',
          tipo: 'carrossel-produtos',
          label: 'Campanha',
          configuracao: {
            showIndicators: false,
            showNavigators: false,
            qtd_desktop: 2,
            qtd_mobile: 2,
            produtos: [
              {
                produto_id: '645821',
                ean: '07894900700015',
                nome: 'Refrigerante Coca-Cola Sem Açúcar Lata 350ml',
                imagem:
                  'https://vendamais.nisseilabs.com.br/media/produtos/645821_1200x1200_enPI8Nc.webp',
                descricao:
                  '<p><span style="font-family: Arial;"><b></b></span><font face="Arial"><b>Refrigerante Coca-Cola Sem Açúcar</b><br></font></p><p><font face="Arial"><br></font></p><p><font face="Arial">A Coca-Cola Sem Açúcar é um refrigerante que não contém calorias! Com certeza você já se perguntou: Então, de onde vem aquele gostinho doce? A Coca-Cola Zero é produzida especialmente com adoçantes para manter o delicioso sabor de Coca-Cola porém com 0% açucar! Toda Coca-Cola é produzida especialmente para manter sempre a qualidade do melhor sabor de refrigerante! Uma garrafa de Coca-Cola é perfeita para compartilhar os melhores momentos da vida com amigos e familiares! Não deixe de conferir todos os produtos Coca-Cola nas <b>Farmácias Nissei</b>.</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Ingredientes:&nbsp;</b></font></p><p><font face="Arial">Água gaseificada, extrato de noz de cola, cafeína, aroma natural, corante caramelo IV, acidulante ácido fosfórico, edulcorantes ciclamato de sódio (27 mg), acesulfame de potássio (15 mg) e aspartame (12 mg) por 100 ml, conservador benzoato de sódio, regulador de acidez citrato de sódio. Contém Fenilalanina.&nbsp;</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Advertência:&nbsp;&nbsp;</b></font></p><p><font face="Arial">Conservar em local fresco, seco e ao abrigo de luz.&nbsp;</font></p><p><font face="Arial">Antes de consumir verifique a data de validade.</font></p><p><font face="Arial">Não consumir caso a embalagem esteja violada.&nbsp;</font></p>',
                tipo_produto: null,
                marca: 'COCA COLA',
                preco: {
                  filial: 23,
                  produto_id: '645821',
                  lista_id: 170,
                  lista_nome: 'preco_base_loja_023',
                  lista_clube: 'filial',
                  vlr_ini: '5.50',
                  produto_nome: 'Refrigerante Coca-Cola Sem Açúcar Lata 350ml',
                  produto_selo: 'produtos/selos/selo_semana[1].webp',
                  produto_is_controlado: false,
                  produto_is_disponivel: true,
                  desconto_id: 52047997,
                  qtd_ini_desc: 2,
                  qtd_fim_desc: null,
                  desconto_valor: '2.50',
                  desconto_percentual: null,
                  desconto_valor_referencia: null,
                  desconto_produto_brinde: null,
                  dat_fim_timer: null,
                  qtd_restante: null,
                  desconto_tipo_id: 'agrupadoJuntoValor',
                  desconto_cor: 'ee3a41',
                  desconto_cor_hover: 'd7343b',
                  desconto_botao_html:
                    '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                  desconto_botao_padrao_html: 'Comprar',
                  desconto_html:
                    '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                  desconto_agrupamento: 'maispormenos',
                  desconto_tipo: 'valor',
                  desconto_is_label: false,
                  desconto_imagem:
                    'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                  desconto_is_sempre_invisivel: false,
                  progressao_quantidade: null,
                  progressao_valor_desconto: null,
                  progressao_percentual_desconto: null,
                  progressao_valor_final: null,
                  progressao_qtd_limite: null,
                  valor_referencia_inicial: '5.50',
                  vlr_fim: '3.00',
                  referencia: 3,
                  is_desconto: true,
                  dat_ini_lista: '1900-01-01',
                  dat_fim_lista: '2999-12-31',
                  dat_ini_preco: null,
                  dat_fim_preco: null,
                  dat_ini_desconto: '2024-02-01T03:00:00Z',
                  dat_fim_desconto: '2024-03-01T03:00:00Z',
                  status_lista: true,
                  status_preco: true,
                  status_relacao: true,
                  status_desconto: true,
                  status_progressao: null,
                },
              },
              {
                produto_id: '122085',
                ean: '07894900011715',
                nome: 'Refrigerante Coca-Cola Pet 1 Litro',
                descricao:
                  '<p><span style="font-family: Arial;"><b></b></span><font face="Arial"><b>Refrigerante Coca-Cola</b><br></font></p><p><font face="Arial"><br></font></p><p><font face="Arial">Com sabor inconfundível e único, a Coca-Cola é o refrigerante mais tradicional e consumido no mundo inteiro! Toda Coca-Cola é produzida especialmente para manter sempre a qualidade do melhor sabor de refrigerante! Uma garrafa de Coca-Cola é perfeita para compartilhar os melhores momentos da vida com amigos e familiares! Não deixe de conferir todos os produtos Coca-Cola nas <b>Farmácias Nissei</b>.</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Ingredientes:&nbsp;</b></font></p><p><font face="Arial">Água gaseificada, açúcar, extrato de noz de cola, cafeína, corante caramelo IV, acidulante ácido fosfórico e aroma natural.</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Advertência:</b></font></p><p><font face="Arial">Conservar em local fresco, seco e ao abrigo de luz.</font></p><p><font face="Arial">Antes de consumir verifique a data de validade.</font></p><p><font face="Arial">Não consumir caso a embalagem esteja violada.</font></p><p><font face="Arial"></font></p>',
                imagem:
                  'https://vendamais.nisseilabs.com.br/media/produtos/122085_1200x1200.jpg',
                tipo_produto: null,
                marca: 'COCA COLA',
                preco: {
                  vlr_fim: 8.95,
                },
              },
              {
                produto_id: '29070',
                ean: '07622210673831',
                nome: 'Chocolate Lacta Ao Leite 80g',
                descricao:
                  '<p><span style="font-family: Arial;"><b></b></span><font face="Arial"><b>Chocolate Lacta Ao Leite</b><br></font></p><p><font face="Arial"><br></font></p><p><font face="Arial">Acrescente um toque de sabor todo especial ao seu dia a dia com a saborosíssima Barra de Chocolate Ao Leite Lacta 90g. Elaborada com ingredientes selecionados é extremamente saborosos. É a escolha perfeita para alegrar o seu dia. Aproveite e adquira já o seu nas <b>Farmácias Nissei</b>.</font></p>',
                imagem:
                  'https://vendamais.nisseilabs.com.br/media/produtos/29070_1200x1200_1rOyNfn.webp',
                tipo_produto: null,
                marca: 'LACTA',
                preco: {
                  filial: 23,
                  produto_id: '29070',
                  lista_id: 170,
                  lista_nome: 'preco_base_loja_023',
                  lista_clube: 'filial',
                  vlr_ini: '6.95',
                  produto_nome: 'Chocolate Lacta Ao Leite 80g',
                  produto_selo: 'produtos/selos/selo_semana[1].webp',
                  produto_is_controlado: false,
                  produto_is_disponivel: true,
                  desconto_id: 49573031,
                  qtd_ini_desc: 2,
                  qtd_fim_desc: null,
                  desconto_valor: '2.20',
                  desconto_percentual: null,
                  desconto_valor_referencia: null,
                  desconto_produto_brinde: null,
                  dat_fim_timer: null,
                  qtd_restante: null,
                  desconto_tipo_id: 'agrupadoJuntoValor',
                  desconto_cor: 'ee3a41',
                  desconto_cor_hover: 'd7343b',
                  desconto_botao_html:
                    '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                  desconto_botao_padrao_html: 'Comprar',
                  desconto_html:
                    '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                  desconto_agrupamento: 'maispormenos',
                  desconto_tipo: 'valor',
                  desconto_is_label: false,
                  desconto_imagem:
                    'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                  desconto_is_sempre_invisivel: false,
                  progressao_quantidade: null,
                  progressao_valor_desconto: null,
                  progressao_percentual_desconto: null,
                  progressao_valor_final: null,
                  progressao_qtd_limite: null,
                  valor_referencia_inicial: '6.95',
                  vlr_fim: '4.75',
                  referencia: 4.75,
                  is_desconto: true,
                  dat_ini_lista: '1900-01-01',
                  dat_fim_lista: '2999-12-31',
                  dat_ini_preco: null,
                  dat_fim_preco: null,
                  dat_ini_desconto: '2024-02-01T03:00:00Z',
                  dat_fim_desconto: '2024-03-01T03:00:00Z',
                  status_lista: true,
                  status_preco: true,
                  status_relacao: true,
                  status_desconto: true,
                  status_progressao: null,
                },
              },
              {
                produto_id: '54354',
                ean: '070847022305',
                nome: 'Energético Monster Absolutely Zero 473ml',
                descricao: '',
                imagem:
                  'https://vendamais.nisseilabs.com.br/media/produtos/54354_200x200_6yYvjEd.jpg',
                tipo_produto: null,
                marca: 'MONSTER',
                preco: {
                  clube_id: 'publico',
                  produto_id: '54354',
                  produtopreco_id: 11588,
                  is_disponivel: true,
                  produto_url: 'energetico-monster-absolutely-zero-473ml',
                  produto_tipo: null,
                  vlr_ini: '9.95',
                  vlr_fim: '7.95',
                  vlr_fim_somado: 23.85,
                  filial_id: null,
                  is_desc: true,
                  desconto_id: 49440780,
                  desconto_nm_descritivo: 'Leve Mais por Menos',
                  dat_fim_timer: '',
                  qtd_restante: null,
                  descontoprodutopreco_id: 55791986,
                  is_desconto_invisivel: null,
                  imagem_selo: null,
                  tipo_desc: 'agrupadoJuntoValor',
                  imagem_desc:
                    'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                  is_label_desc: false,
                  cor_desc: 'ee3a41',
                  cor_hover_desc: 'd7343b',
                  descricao_html:
                    '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                  descricao_botao_html:
                    '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                  descricao_botao_padrao_html: 'Comprar',
                  per_desc: '20.10',
                  vlr_desc: '2.00',
                  qtd_ini_desc: 3,
                  qtd_fim_desc: null,
                  dat_ini_desc: '2024-02-01 03:00:00+00:00',
                  dat_fim_desc: '2024-03-01 03:00:00+00:00',
                  cd_produto_final_id: null,
                  cd_produto_final_nome: null,
                  cd_produto_final_url: null,
                  referencia: 7.95,
                  hash: 'NTQzNTRfXzExNTg4X181NTc5MTk4Ng==',
                  tipo_clube: 'clube',
                  is_retencao_receita: false,
                  is_controlado: false,
                  qtd_limite: null,
                  is_funcionario: true,
                  produto_is_funcionario: false,
                },
              },
            ],
          },
        },
        {
          grid: 'col-12 md:col-2',
          tipo: 'carrossel-produtos',
          label: 'Do dia',
          configuracao: {
            showIndicators: false,
            showNavigators: false,
            qtd_desktop: 1,
            qtd_mobile: 2,
            produtos: [
              {
                produto_id: '645821',
                ean: '07894900700015',
                nome: 'Refrigerante Coca-Cola Sem Açúcar Lata 350ml',
                imagem:
                  'https://vendamais.nisseilabs.com.br/media/produtos/645821_1200x1200_enPI8Nc.webp',
                descricao:
                  '<p><span style="font-family: Arial;"><b></b></span><font face="Arial"><b>Refrigerante Coca-Cola Sem Açúcar</b><br></font></p><p><font face="Arial"><br></font></p><p><font face="Arial">A Coca-Cola Sem Açúcar é um refrigerante que não contém calorias! Com certeza você já se perguntou: Então, de onde vem aquele gostinho doce? A Coca-Cola Zero é produzida especialmente com adoçantes para manter o delicioso sabor de Coca-Cola porém com 0% açucar! Toda Coca-Cola é produzida especialmente para manter sempre a qualidade do melhor sabor de refrigerante! Uma garrafa de Coca-Cola é perfeita para compartilhar os melhores momentos da vida com amigos e familiares! Não deixe de conferir todos os produtos Coca-Cola nas <b>Farmácias Nissei</b>.</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Ingredientes:&nbsp;</b></font></p><p><font face="Arial">Água gaseificada, extrato de noz de cola, cafeína, aroma natural, corante caramelo IV, acidulante ácido fosfórico, edulcorantes ciclamato de sódio (27 mg), acesulfame de potássio (15 mg) e aspartame (12 mg) por 100 ml, conservador benzoato de sódio, regulador de acidez citrato de sódio. Contém Fenilalanina.&nbsp;</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Advertência:&nbsp;&nbsp;</b></font></p><p><font face="Arial">Conservar em local fresco, seco e ao abrigo de luz.&nbsp;</font></p><p><font face="Arial">Antes de consumir verifique a data de validade.</font></p><p><font face="Arial">Não consumir caso a embalagem esteja violada.&nbsp;</font></p>',
                tipo_produto: null,
                marca: 'COCA COLA',
                preco: {
                  filial: 23,
                  produto_id: '645821',
                  lista_id: 170,
                  lista_nome: 'preco_base_loja_023',
                  lista_clube: 'filial',
                  vlr_ini: '5.50',
                  produto_nome: 'Refrigerante Coca-Cola Sem Açúcar Lata 350ml',
                  produto_selo: 'produtos/selos/selo_semana[1].webp',
                  produto_is_controlado: false,
                  produto_is_disponivel: true,
                  desconto_id: 52047997,
                  qtd_ini_desc: 2,
                  qtd_fim_desc: null,
                  desconto_valor: '2.50',
                  desconto_percentual: null,
                  desconto_valor_referencia: null,
                  desconto_produto_brinde: null,
                  dat_fim_timer: null,
                  qtd_restante: null,
                  desconto_tipo_id: 'agrupadoJuntoValor',
                  desconto_cor: 'ee3a41',
                  desconto_cor_hover: 'd7343b',
                  desconto_botao_html:
                    '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                  desconto_botao_padrao_html: 'Comprar',
                  desconto_html:
                    '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                  desconto_agrupamento: 'maispormenos',
                  desconto_tipo: 'valor',
                  desconto_is_label: false,
                  desconto_imagem:
                    'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                  desconto_is_sempre_invisivel: false,
                  progressao_quantidade: null,
                  progressao_valor_desconto: null,
                  progressao_percentual_desconto: null,
                  progressao_valor_final: null,
                  progressao_qtd_limite: null,
                  valor_referencia_inicial: '5.50',
                  vlr_fim: '3.00',
                  referencia: 3,
                  is_desconto: true,
                  dat_ini_lista: '1900-01-01',
                  dat_fim_lista: '2999-12-31',
                  dat_ini_preco: null,
                  dat_fim_preco: null,
                  dat_ini_desconto: '2024-02-01T03:00:00Z',
                  dat_fim_desconto: '2024-03-01T03:00:00Z',
                  status_lista: true,
                  status_preco: true,
                  status_relacao: true,
                  status_desconto: true,
                  status_progressao: null,
                },
              },
              {
                produto_id: '122085',
                ean: '07894900011715',
                nome: 'Refrigerante Coca-Cola Pet 1 Litro',
                descricao:
                  '<p><span style="font-family: Arial;"><b></b></span><font face="Arial"><b>Refrigerante Coca-Cola</b><br></font></p><p><font face="Arial"><br></font></p><p><font face="Arial">Com sabor inconfundível e único, a Coca-Cola é o refrigerante mais tradicional e consumido no mundo inteiro! Toda Coca-Cola é produzida especialmente para manter sempre a qualidade do melhor sabor de refrigerante! Uma garrafa de Coca-Cola é perfeita para compartilhar os melhores momentos da vida com amigos e familiares! Não deixe de conferir todos os produtos Coca-Cola nas <b>Farmácias Nissei</b>.</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Ingredientes:&nbsp;</b></font></p><p><font face="Arial">Água gaseificada, açúcar, extrato de noz de cola, cafeína, corante caramelo IV, acidulante ácido fosfórico e aroma natural.</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Advertência:</b></font></p><p><font face="Arial">Conservar em local fresco, seco e ao abrigo de luz.</font></p><p><font face="Arial">Antes de consumir verifique a data de validade.</font></p><p><font face="Arial">Não consumir caso a embalagem esteja violada.</font></p><p><font face="Arial"></font></p>',
                imagem:
                  'https://vendamais.nisseilabs.com.br/media/produtos/122085_1200x1200.jpg',
                tipo_produto: null,
                marca: 'COCA COLA',
                preco: {
                  vlr_fim: 8.95,
                },
              },
              {
                produto_id: '29070',
                ean: '07622210673831',
                nome: 'Chocolate Lacta Ao Leite 80g',
                descricao:
                  '<p><span style="font-family: Arial;"><b></b></span><font face="Arial"><b>Chocolate Lacta Ao Leite</b><br></font></p><p><font face="Arial"><br></font></p><p><font face="Arial">Acrescente um toque de sabor todo especial ao seu dia a dia com a saborosíssima Barra de Chocolate Ao Leite Lacta 90g. Elaborada com ingredientes selecionados é extremamente saborosos. É a escolha perfeita para alegrar o seu dia. Aproveite e adquira já o seu nas <b>Farmácias Nissei</b>.</font></p>',
                imagem:
                  'https://vendamais.nisseilabs.com.br/media/produtos/29070_1200x1200_1rOyNfn.webp',
                tipo_produto: null,
                marca: 'LACTA',
                preco: {
                  filial: 23,
                  produto_id: '29070',
                  lista_id: 170,
                  lista_nome: 'preco_base_loja_023',
                  lista_clube: 'filial',
                  vlr_ini: '6.95',
                  produto_nome: 'Chocolate Lacta Ao Leite 80g',
                  produto_selo: 'produtos/selos/selo_semana[1].webp',
                  produto_is_controlado: false,
                  produto_is_disponivel: true,
                  desconto_id: 49573031,
                  qtd_ini_desc: 2,
                  qtd_fim_desc: null,
                  desconto_valor: '2.20',
                  desconto_percentual: null,
                  desconto_valor_referencia: null,
                  desconto_produto_brinde: null,
                  dat_fim_timer: null,
                  qtd_restante: null,
                  desconto_tipo_id: 'agrupadoJuntoValor',
                  desconto_cor: 'ee3a41',
                  desconto_cor_hover: 'd7343b',
                  desconto_botao_html:
                    '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                  desconto_botao_padrao_html: 'Comprar',
                  desconto_html:
                    '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                  desconto_agrupamento: 'maispormenos',
                  desconto_tipo: 'valor',
                  desconto_is_label: false,
                  desconto_imagem:
                    'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                  desconto_is_sempre_invisivel: false,
                  progressao_quantidade: null,
                  progressao_valor_desconto: null,
                  progressao_percentual_desconto: null,
                  progressao_valor_final: null,
                  progressao_qtd_limite: null,
                  valor_referencia_inicial: '6.95',
                  vlr_fim: '4.75',
                  referencia: 4.75,
                  is_desconto: true,
                  dat_ini_lista: '1900-01-01',
                  dat_fim_lista: '2999-12-31',
                  dat_ini_preco: null,
                  dat_fim_preco: null,
                  dat_ini_desconto: '2024-02-01T03:00:00Z',
                  dat_fim_desconto: '2024-03-01T03:00:00Z',
                  status_lista: true,
                  status_preco: true,
                  status_relacao: true,
                  status_desconto: true,
                  status_progressao: null,
                },
              },
              {
                produto_id: '54354',
                ean: '070847022305',
                nome: 'Energético Monster Absolutely Zero 473ml',
                descricao: '',
                imagem:
                  'https://vendamais.nisseilabs.com.br/media/produtos/54354_200x200_6yYvjEd.jpg',
                tipo_produto: null,
                marca: 'MONSTER',
                preco: {
                  clube_id: 'publico',
                  produto_id: '54354',
                  produtopreco_id: 11588,
                  is_disponivel: true,
                  produto_url: 'energetico-monster-absolutely-zero-473ml',
                  produto_tipo: null,
                  vlr_ini: '9.95',
                  vlr_fim: '7.95',
                  vlr_fim_somado: 23.85,
                  filial_id: null,
                  is_desc: true,
                  desconto_id: 49440780,
                  desconto_nm_descritivo: 'Leve Mais por Menos',
                  dat_fim_timer: '',
                  qtd_restante: null,
                  descontoprodutopreco_id: 55791986,
                  is_desconto_invisivel: null,
                  imagem_selo: null,
                  tipo_desc: 'agrupadoJuntoValor',
                  imagem_desc:
                    'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                  is_label_desc: false,
                  cor_desc: 'ee3a41',
                  cor_hover_desc: 'd7343b',
                  descricao_html:
                    '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                  descricao_botao_html:
                    '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                  descricao_botao_padrao_html: 'Comprar',
                  per_desc: '20.10',
                  vlr_desc: '2.00',
                  qtd_ini_desc: 3,
                  qtd_fim_desc: null,
                  dat_ini_desc: '2024-02-01 03:00:00+00:00',
                  dat_fim_desc: '2024-03-01 03:00:00+00:00',
                  cd_produto_final_id: null,
                  cd_produto_final_nome: null,
                  cd_produto_final_url: null,
                  referencia: 7.95,
                  hash: 'NTQzNTRfXzExNTg4X181NTc5MTk4Ng==',
                  tipo_clube: 'clube',
                  is_retencao_receita: false,
                  is_controlado: false,
                  qtd_limite: null,
                  is_funcionario: true,
                  produto_is_funcionario: false,
                },
              },
            ],
          },
        }
      ]
    });
    return this.http.get<any>(`${this.API_ONLINE}produtos_carrossel`);
  }

  buscarHTMLVantagensClub(): Observable<any> {
    return of({
      status: true,
      html: '<p class="MsoNormal" align="center" style="margin-right:2.25pt;mso-margin-bottom-alt: auto;margin-left:0cm;text-align:center;text-indent:0cm;line-height:150%; mso-pagination:none;mso-layout-grid-align:none;text-autospace:none"><b><span style="font-family:&quot;Arial&quot;,sans-serif"><b>REGULAMENTO DO CLUB NISSEI DE VANTAGENS</b><o:p></o:p></span></b></p><p class="MsoListParagraphCxSpFirst" style="margin-right:2.25pt;mso-margin-bottom-alt: auto;margin-left:7.1pt;mso-add-space:auto;text-indent:-14.2pt;line-height:150%; mso-pagination:none;mso-list:l2 level1 lfo1;mso-layout-grid-align:none; text-autospace:none"><!--[if !supportLists]--><b><span style="font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:Arial">1.<span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 7pt; line-height: normal; font-family: &quot;Times New Roman&quot;;">&nbsp; </span></span><!--[endif]--><span style="font-family:&quot;Arial&quot;,sans-serif"><b>DAS CONDIÇÕES GERAIS<br><br></b><o:p></o:p></span></b></p><p class="MsoListParagraph" style="margin-right:2.25pt;mso-margin-bottom-alt: auto;margin-left:39.0pt;text-indent:-21.0pt;line-height:150%;mso-pagination: none;mso-list:l2 level2 lfo1;mso-layout-grid-align:none;text-autospace:none"><!--[if !supportLists]--><span style="font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:Arial">1.1<span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 7pt; line-height: normal; font-family: &quot;Times New Roman&quot;;">&nbsp;&nbsp; </span></span><!--[endif]--><span style="font-family:&quot;Arial&quot;,sans-serif">O presente instrumento tem como objetivo regular a participação dos clientes cadastrados no “Club Nissei de Vantagens”, criado e administrado pela Farmácia e Drogaria Nissei S/A.<o:p></o:p></span></p><p class="MsoListParagraph" style="margin-right:2.25pt;mso-margin-bottom-alt: auto;margin-left:39.0pt;text-indent:-21.0pt;line-height:150%;mso-pagination: none;mso-list:l2 level2 lfo1;mso-layout-grid-align:none;text-autospace:none"><!--[if !supportLists]--><span style="font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:Arial">1.2<span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 7pt; line-height: normal; font-family: &quot;Times New Roman&quot;;">&nbsp;&nbsp; </span></span><!--[endif]--><span style="font-family:&quot;Arial&quot;,sans-serif">O “Club Nissei de Vantagens” é um programa de relacionamento entre a Farmácia e Drogaria Nissei S/A e seus participantes, com o objetivo de oferecer benefícios, ofertas exclusivas e promoções por intermédio de descontos em produtos e serviços disponíveis nas lojas da NISSEI, baseadas nas compras dos clientes realizadas nas lojas da rede.<o:p></o:p></span></p><p class="MsoListParagraph" style="margin-right:2.25pt;mso-margin-bottom-alt: auto;margin-left:39.0pt;text-indent:-21.0pt;line-height:150%;mso-pagination: none;mso-list:l2 level2 lfo1;mso-layout-grid-align:none;text-autospace:none"><!--[if !supportLists]--><span style="font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:Arial;letter-spacing: -.1pt">1.3<span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 7pt; line-height: normal; font-family: &quot;Times New Roman&quot;;">&nbsp;&nbsp; </span></span><!--[endif]--><span style="font-family:&quot;Arial&quot;,sans-serif">Ao ade<span style="letter-spacing:.05pt">r</span><span style="letter-spacing:-.05pt">i</span>r ao “Club Nissei de Vantagens” de forma espontânea, o cliente declara que leu o presente regulamento, entendeu-o e conc<span style="letter-spacing:-.15pt">o</span><span style="letter-spacing:.05pt">r</span>da integralmente c<span style="letter-spacing: -.15pt">o</span>m todos <span style="letter-spacing:-.15pt">o</span>s seus <span style="letter-spacing:.05pt">t</span>e<span style="letter-spacing:-.05pt">r</span><span style="letter-spacing:.05pt">m</span>os, regras<span style="letter-spacing: .1pt"> </span>e<span style="letter-spacing:-.05pt"> </span>cond<span style="letter-spacing:-.05pt">i</span>ções. <br><br><u><span style="letter-spacing: -.1pt"><o:p></o:p></span></u></span></p><p class="MsoListParagraph" style="margin-right:2.25pt;mso-margin-bottom-alt: auto;margin-left:7.1pt;text-indent:-14.2pt;line-height:150%;mso-pagination: none;mso-list:l2 level1 lfo1;mso-layout-grid-align:none;text-autospace:none"><!--[if !supportLists]--><b><span style="font-family:&quot;Arial&quot;,sans-serif; mso-fareast-font-family:Arial;letter-spacing:-.1pt">2.<span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 7pt; line-height: normal; font-family: &quot;Times New Roman&quot;;">&nbsp; </span></span><!--[endif]--><span style="font-family:&quot;Arial&quot;,sans-serif"><b>DAS DEFINIÇÕES<br><br></b><u><span style="letter-spacing:-.1pt"><o:p></o:p></span></u></span></b></p><p class="MsoListParagraph" style="margin-right:2.25pt;mso-margin-bottom-alt: auto;margin-left:39.0pt;text-indent:-21.0pt;line-height:150%;mso-pagination: none;mso-list:l2 level2 lfo1;mso-layout-grid-align:none;text-autospace:none"><!--[if !supportLists]--><span style="font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:Arial;letter-spacing: -.1pt">2.1<span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 7pt; line-height: normal; font-family: &quot;Times New Roman&quot;;">&nbsp;&nbsp; </span></span><!--[endif]--><span style="font-family:&quot;Arial&quot;,sans-serif">Para fins do presente regulamento, são as seguintes definições:<u><span style="letter-spacing:-.1pt"><o:p></o:p></span></u></span></p><p class="MsoListParagraph" style="margin-right:2.25pt;mso-margin-bottom-alt: auto;margin-left:42.55pt;text-indent:0cm;line-height:150%;mso-pagination:none; mso-list:l2 level3 lfo1;mso-layout-grid-align:none;text-autospace:none"><a name="_Hlk90566320"><!--[if !supportLists]--><span style="font-family:&quot;Arial&quot;,sans-serif; mso-fareast-font-family:Arial">2.1.1<span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 7pt; line-height: normal; font-family: &quot;Times New Roman&quot;;">&nbsp; </span></span><!--[endif]--><span style="font-family:&quot;Arial&quot;,sans-serif"><b>CRÉDITOS ACUMULADOS</b></span></a><span style="font-family:&quot;Arial&quot;,sans-serif"> é um valor de retorno para utilização em uma compra futura, ou seja, um crédito virtual convertido eletronicamente em crédito para futuras compras, vinculado ao CPF do cliente cadastrado. Assim, ao acumular determinado(s) valor(es) o cliente poderá utilizá-los, exclusiva e especificamente para abatimento no pagamento de compras futuras, de acordo com as normas contidas neste regulamento.<o:p></o:p></span></p><p class="MsoListParagraph" style="margin-right:2.25pt;mso-margin-bottom-alt: auto;margin-left:70.9pt;text-indent:0cm;line-height:150%;mso-pagination:none; mso-list:l2 level4 lfo1;mso-layout-grid-align:none;text-autospace:none"><!--[if !supportLists]--><span style="font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:Arial">2.1.1.1<span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 7pt; line-height: normal; font-family: &quot;Times New Roman&quot;;"> </span></span><!--[endif]--><span style="font-family:&quot;Arial&quot;,sans-serif">&nbsp;O presente programa de vantagens não significa a cobrança à maior ou retenção de valores pagos, mas sim de crédito concedido por mera liberalidade pela NISSEI aos clientes cadastrados. <o:p></o:p></span></p><p class="MsoListParagraph" style="margin-right:2.25pt;mso-margin-bottom-alt: auto;margin-left:70.9pt;text-indent:0cm;line-height:150%;mso-pagination:none; mso-list:l2 level4 lfo1;mso-layout-grid-align:none;text-autospace:none"><!--[if !supportLists]--><span style="font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:Arial">2.1.1.2<span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 7pt; line-height: normal; font-family: &quot;Times New Roman&quot;;"> </span></span><!--[endif]--><span style="font-family:&quot;Arial&quot;,sans-serif">A NISSEI tem poder de gestão e administração de todo o sistema e tomará todas as decisões referentes às operações de uso desses valores em sua rede de drogarias.<o:p></o:p></span></p><p class="MsoListParagraph" style="margin-right:2.25pt;mso-margin-bottom-alt: auto;margin-left:42.55pt;text-indent:0cm;line-height:150%;mso-pagination:none; mso-list:l2 level3 lfo1;mso-layout-grid-align:none;text-autospace:none"><!--[if !supportLists]--><span style="font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:Arial">2.1.2<span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 7pt; line-height: normal; font-family: &quot;Times New Roman&quot;;">&nbsp; </span></span><!--[endif]--><span style="font-family:&quot;Arial&quot;,sans-serif"><b>&nbsp;CLIENTE OU ASSOCIADO</b></span><span style="font-family:&quot;Arial&quot;,sans-serif"><b>:</b> pessoa</span> <span style="font-family: &quot;Arial&quot;,sans-serif">física que aderiu livre e espontaneamente ao “Club Nissei de Vantagens”, efetuando seu cadastro.<o:p></o:p></span></p><p class="MsoListParagraph" style="margin-right:2.25pt;mso-margin-bottom-alt: auto;margin-left:42.55pt;text-indent:0cm;line-height:150%;mso-pagination:none; mso-list:l2 level3 lfo1;mso-layout-grid-align:none;text-autospace:none"><!--[if !supportLists]--><span style="font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:Arial">2.1.3<span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 7pt; line-height: normal; font-family: &quot;Times New Roman&quot;;">&nbsp; </span></span><!--[endif]--><b><span style="font-family:&quot;Arial&quot;,sans-serif"><b>CARTEIRA DIGITAL:</b> </span></b><span style="font-family:&quot;Arial&quot;,sans-serif;mso-bidi-font-weight: bold">é o local virtual em que são adicionados os CRÉDITOS ACUMULADOS vinculados ao CPF do CLIENTE.<br><br></span>'
    });
    return this.http.get<any>(`${this.API_ONLINE}buscar/html/club`);
  }

  buscarCrs(): Observable<any> {
    return of({
      status: true,
      crs: [
        { value: 'CRM', label: 'CRM' },
        { value: 'CRF', label: 'CRF' },
        { value: 'CRMV', label: 'CRMV' },
        { value: 'CRO', label: 'CRO' },
      ],
    });
    return this.http.get<any>(`${this.API_ONLINE}buscar/cr`);
  }

  buscarEstados(): Observable<any> {
    return of({
      status: true,
      estados: [
        {
          nome: 'Acre',
          nm_abrev: 'AC',
          codigo: 12,
          id: 12,
          nm_descritivo: 'Acre',
        },
        {
          nome: 'Alagoas',
          nm_abrev: 'AL',
          codigo: 27,
          id: 27,
          nm_descritivo: 'Alagoas',
        },
        {
          nome: 'Amapá',
          nm_abrev: 'AP',
          codigo: 16,
          id: 16,
          nm_descritivo: 'Amapá',
        },
        {
          nome: 'Amazonas',
          nm_abrev: 'AM',
          codigo: 13,
          id: 13,
          nm_descritivo: 'Amazonas',
        },
        {
          nome: 'Bahia',
          nm_abrev: 'BA',
          codigo: 29,
          id: 29,
          nm_descritivo: 'Bahia',
        },
        {
          nome: 'Ceará',
          nm_abrev: 'CE',
          codigo: 23,
          id: 23,
          nm_descritivo: 'Ceará',
        },
        {
          nome: 'Distrito Federal',
          nm_abrev: 'DF',
          codigo: 53,
          id: 53,
          nm_descritivo: 'Distrito Federal',
        },
        {
          nome: 'Espírito Santo',
          nm_abrev: 'ES',
          codigo: 32,
          id: 32,
          nm_descritivo: 'Espírito Santo',
        },
        {
          nome: 'Goiás',
          nm_abrev: 'GO',
          codigo: 52,
          id: 52,
          nm_descritivo: 'Goiás',
        },
        {
          nome: 'Maranhão',
          nm_abrev: 'MA',
          codigo: 21,
          id: 21,
          nm_descritivo: 'Maranhão',
        },
        {
          nome: 'Mato Grosso',
          nm_abrev: 'MT',
          codigo: 51,
          id: 51,
          nm_descritivo: 'Mato Grosso',
        },
        {
          nome: 'Mato Grosso do Sul',
          nm_abrev: 'MS',
          codigo: 50,
          id: 50,
          nm_descritivo: 'Mato Grosso do Sul',
        },
        {
          nome: 'Minas Gerais',
          nm_abrev: 'MG',
          codigo: 31,
          id: 31,
          nm_descritivo: 'Minas Gerais',
        },
        {
          nome: 'Pará',
          nm_abrev: 'PA',
          codigo: 15,
          id: 15,
          nm_descritivo: 'Pará',
        },
        {
          nome: 'Paraíba',
          nm_abrev: 'PB',
          codigo: 25,
          id: 25,
          nm_descritivo: 'Paraíba',
        },
        {
          nome: 'Paraná',
          nm_abrev: 'PR',
          codigo: 41,
          id: 41,
          nm_descritivo: 'Paraná',
        },
        {
          nome: 'Pernambuco',
          nm_abrev: 'PE',
          codigo: 26,
          id: 26,
          nm_descritivo: 'Pernambuco',
        },
        {
          nome: 'Piauí',
          nm_abrev: 'PI',
          codigo: 22,
          id: 22,
          nm_descritivo: 'Piauí',
        },
        {
          nome: 'Rio de Janeiro',
          nm_abrev: 'RJ',
          codigo: 33,
          id: 33,
          nm_descritivo: 'Rio de Janeiro',
        },
        {
          nome: 'Rio Grande do Norte',
          nm_abrev: 'RN',
          codigo: 24,
          id: 24,
          nm_descritivo: 'Rio Grande do Norte',
        },
        {
          nome: 'Rio Grande do Sul',
          nm_abrev: 'RS',
          codigo: 43,
          id: 43,
          nm_descritivo: 'Rio Grande do Sul',
        },
        {
          nome: 'Rondônia',
          nm_abrev: 'RO',
          codigo: 11,
          id: 11,
          nm_descritivo: 'Rondônia',
        },
        {
          nome: 'Roraima',
          nm_abrev: 'RR',
          codigo: 14,
          id: 14,
          nm_descritivo: 'Roraima',
        },
        {
          nome: 'Santa Catarina',
          nm_abrev: 'SC',
          codigo: 42,
          id: 42,
          nm_descritivo: 'Santa Catarina',
        },
        {
          nome: 'São Paulo',
          nm_abrev: 'SP',
          codigo: 35,
          id: 35,
          nm_descritivo: 'São Paulo',
        },
        {
          nome: 'Sergipe',
          nm_abrev: 'SE',
          codigo: 28,
          id: 28,
          nm_descritivo: 'Sergipe',
        },
        {
          nome: 'Tocantins',
          nm_abrev: 'TO',
          codigo: 17,
          id: 17,
          nm_descritivo: 'Tocantins',
        },
      ],
    });
    return this.http.get<any>(`${this.API_ONLINE}buscar/cr`);
  }

  buscarComponentesClub(): Observable<any> {
    return of({
      status: true,
      componente_club: {
        grid: 'col-12',
        tipo: 'carrossel-produtos',
        label: 'Encarte',
        configuracao: {
          showIndicators: false,
          showNavigators: false,
          qtd_desktop: 5,
          qtd_mobile: 3,
          produtos: [
            {
              produto_id: '645821',
              ean: '07894900700015',
              nome: 'Refrigerante Coca-Cola Sem Açúcar Lata 350ml',
              imagem:
                'https://vendamais.nisseilabs.com.br/media/produtos/645821_1200x1200_enPI8Nc.webp',
              descricao:
                '<p><span style="font-family: Arial;"><b></b></span><font face="Arial"><b>Refrigerante Coca-Cola Sem Açúcar</b><br></font></p><p><font face="Arial"><br></font></p><p><font face="Arial">A Coca-Cola Sem Açúcar é um refrigerante que não contém calorias! Com certeza você já se perguntou: Então, de onde vem aquele gostinho doce? A Coca-Cola Zero é produzida especialmente com adoçantes para manter o delicioso sabor de Coca-Cola porém com 0% açucar! Toda Coca-Cola é produzida especialmente para manter sempre a qualidade do melhor sabor de refrigerante! Uma garrafa de Coca-Cola é perfeita para compartilhar os melhores momentos da vida com amigos e familiares! Não deixe de conferir todos os produtos Coca-Cola nas <b>Farmácias Nissei</b>.</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Ingredientes:&nbsp;</b></font></p><p><font face="Arial">Água gaseificada, extrato de noz de cola, cafeína, aroma natural, corante caramelo IV, acidulante ácido fosfórico, edulcorantes ciclamato de sódio (27 mg), acesulfame de potássio (15 mg) e aspartame (12 mg) por 100 ml, conservador benzoato de sódio, regulador de acidez citrato de sódio. Contém Fenilalanina.&nbsp;</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Advertência:&nbsp;&nbsp;</b></font></p><p><font face="Arial">Conservar em local fresco, seco e ao abrigo de luz.&nbsp;</font></p><p><font face="Arial">Antes de consumir verifique a data de validade.</font></p><p><font face="Arial">Não consumir caso a embalagem esteja violada.&nbsp;</font></p>',
              tipo_produto: null,
              marca: 'COCA COLA',
              preco: {
                filial: 23,
                produto_id: '645821',
                lista_id: 170,
                lista_nome: 'preco_base_loja_023',
                lista_clube: 'filial',
                vlr_ini: '5.50',
                produto_nome: 'Refrigerante Coca-Cola Sem Açúcar Lata 350ml',
                produto_selo: 'produtos/selos/selo_semana[1].webp',
                produto_is_controlado: false,
                produto_is_disponivel: true,
                desconto_id: 52047997,
                qtd_ini_desc: 2,
                qtd_fim_desc: null,
                desconto_valor: '2.50',
                desconto_percentual: null,
                desconto_valor_referencia: null,
                desconto_produto_brinde: null,
                dat_fim_timer: null,
                qtd_restante: null,
                desconto_tipo_id: 'agrupadoJuntoValor',
                desconto_cor: 'ee3a41',
                desconto_cor_hover: 'd7343b',
                desconto_botao_html:
                  '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                desconto_botao_padrao_html: 'Comprar',
                desconto_html:
                  '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                desconto_agrupamento: 'maispormenos',
                desconto_tipo: 'valor',
                desconto_is_label: false,
                desconto_imagem:
                  'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                desconto_is_sempre_invisivel: false,
                progressao_quantidade: null,
                progressao_valor_desconto: null,
                progressao_percentual_desconto: null,
                progressao_valor_final: null,
                progressao_qtd_limite: null,
                valor_referencia_inicial: '5.50',
                vlr_fim: '3.00',
                referencia: 3,
                is_desconto: true,
                dat_ini_lista: '1900-01-01',
                dat_fim_lista: '2999-12-31',
                dat_ini_preco: null,
                dat_fim_preco: null,
                dat_ini_desconto: '2024-02-01T03:00:00Z',
                dat_fim_desconto: '2024-03-01T03:00:00Z',
                status_lista: true,
                status_preco: true,
                status_relacao: true,
                status_desconto: true,
                status_progressao: null,
              },
            },
            {
              produto_id: '122085',
              ean: '07894900011715',
              nome: 'Refrigerante Coca-Cola Pet 1 Litro',
              descricao:
                '<p><span style="font-family: Arial;"><b></b></span><font face="Arial"><b>Refrigerante Coca-Cola</b><br></font></p><p><font face="Arial"><br></font></p><p><font face="Arial">Com sabor inconfundível e único, a Coca-Cola é o refrigerante mais tradicional e consumido no mundo inteiro! Toda Coca-Cola é produzida especialmente para manter sempre a qualidade do melhor sabor de refrigerante! Uma garrafa de Coca-Cola é perfeita para compartilhar os melhores momentos da vida com amigos e familiares! Não deixe de conferir todos os produtos Coca-Cola nas <b>Farmácias Nissei</b>.</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Ingredientes:&nbsp;</b></font></p><p><font face="Arial">Água gaseificada, açúcar, extrato de noz de cola, cafeína, corante caramelo IV, acidulante ácido fosfórico e aroma natural.</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Advertência:</b></font></p><p><font face="Arial">Conservar em local fresco, seco e ao abrigo de luz.</font></p><p><font face="Arial">Antes de consumir verifique a data de validade.</font></p><p><font face="Arial">Não consumir caso a embalagem esteja violada.</font></p><p><font face="Arial"></font></p>',
              imagem:
                'https://vendamais.nisseilabs.com.br/media/produtos/122085_1200x1200.jpg',
              tipo_produto: null,
              marca: 'COCA COLA',
              preco: {
                vlr_fim: 8.95,
              },
            },
            {
              produto_id: '29070',
              ean: '07622210673831',
              nome: 'Chocolate Lacta Ao Leite 80g',
              descricao:
                '<p><span style="font-family: Arial;"><b></b></span><font face="Arial"><b>Chocolate Lacta Ao Leite</b><br></font></p><p><font face="Arial"><br></font></p><p><font face="Arial">Acrescente um toque de sabor todo especial ao seu dia a dia com a saborosíssima Barra de Chocolate Ao Leite Lacta 90g. Elaborada com ingredientes selecionados é extremamente saborosos. É a escolha perfeita para alegrar o seu dia. Aproveite e adquira já o seu nas <b>Farmácias Nissei</b>.</font></p>',
              imagem:
                'https://vendamais.nisseilabs.com.br/media/produtos/29070_1200x1200_1rOyNfn.webp',
              tipo_produto: null,
              marca: 'LACTA',
              preco: {
                filial: 23,
                produto_id: '29070',
                lista_id: 170,
                lista_nome: 'preco_base_loja_023',
                lista_clube: 'filial',
                vlr_ini: '6.95',
                produto_nome: 'Chocolate Lacta Ao Leite 80g',
                produto_selo: 'produtos/selos/selo_semana[1].webp',
                produto_is_controlado: false,
                produto_is_disponivel: true,
                desconto_id: 49573031,
                qtd_ini_desc: 2,
                qtd_fim_desc: null,
                desconto_valor: '2.20',
                desconto_percentual: null,
                desconto_valor_referencia: null,
                desconto_produto_brinde: null,
                dat_fim_timer: null,
                qtd_restante: null,
                desconto_tipo_id: 'agrupadoJuntoValor',
                desconto_cor: 'ee3a41',
                desconto_cor_hover: 'd7343b',
                desconto_botao_html:
                  '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                desconto_botao_padrao_html: 'Comprar',
                desconto_html:
                  '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                desconto_agrupamento: 'maispormenos',
                desconto_tipo: 'valor',
                desconto_is_label: false,
                desconto_imagem:
                  'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                desconto_is_sempre_invisivel: false,
                progressao_quantidade: null,
                progressao_valor_desconto: null,
                progressao_percentual_desconto: null,
                progressao_valor_final: null,
                progressao_qtd_limite: null,
                valor_referencia_inicial: '6.95',
                vlr_fim: '4.75',
                referencia: 4.75,
                is_desconto: true,
                dat_ini_lista: '1900-01-01',
                dat_fim_lista: '2999-12-31',
                dat_ini_preco: null,
                dat_fim_preco: null,
                dat_ini_desconto: '2024-02-01T03:00:00Z',
                dat_fim_desconto: '2024-03-01T03:00:00Z',
                status_lista: true,
                status_preco: true,
                status_relacao: true,
                status_desconto: true,
                status_progressao: null,
              },
            },
            {
              produto_id: '54354',
              ean: '070847022305',
              nome: 'Energético Monster Absolutely Zero 473ml',
              descricao: '',
              imagem:
                'https://vendamais.nisseilabs.com.br/media/produtos/54354_200x200_6yYvjEd.jpg',
              tipo_produto: null,
              marca: 'MONSTER',
              preco: {
                clube_id: 'publico',
                produto_id: '54354',
                produtopreco_id: 11588,
                is_disponivel: true,
                produto_url: 'energetico-monster-absolutely-zero-473ml',
                produto_tipo: null,
                vlr_ini: '9.95',
                vlr_fim: '7.95',
                vlr_fim_somado: 23.85,
                filial_id: null,
                is_desc: true,
                desconto_id: 49440780,
                desconto_nm_descritivo: 'Leve Mais por Menos',
                dat_fim_timer: '',
                qtd_restante: null,
                descontoprodutopreco_id: 55791986,
                is_desconto_invisivel: null,
                imagem_selo: null,
                tipo_desc: 'agrupadoJuntoValor',
                imagem_desc:
                  'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                is_label_desc: false,
                cor_desc: 'ee3a41',
                cor_hover_desc: 'd7343b',
                descricao_html:
                  '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                descricao_botao_html:
                  '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                descricao_botao_padrao_html: 'Comprar',
                per_desc: '20.10',
                vlr_desc: '2.00',
                qtd_ini_desc: 3,
                qtd_fim_desc: null,
                dat_ini_desc: '2024-02-01 03:00:00+00:00',
                dat_fim_desc: '2024-03-01 03:00:00+00:00',
                cd_produto_final_id: null,
                cd_produto_final_nome: null,
                cd_produto_final_url: null,
                referencia: 7.95,
                hash: 'NTQzNTRfXzExNTg4X181NTc5MTk4Ng==',
                tipo_clube: 'clube',
                is_retencao_receita: false,
                is_controlado: false,
                qtd_limite: null,
                is_funcionario: true,
                produto_is_funcionario: false,
              },
            },
            {
              produto_id: '54354',
              ean: '070847022305',
              nome: 'Energético Monster Absolutely Zero 473ml',
              descricao: '',
              imagem:
                'https://vendamais.nisseilabs.com.br/media/produtos/54354_200x200_6yYvjEd.jpg',
              tipo_produto: null,
              marca: 'MONSTER',
              preco: {
                clube_id: 'publico',
                produto_id: '54354',
                produtopreco_id: 11588,
                is_disponivel: true,
                produto_url: 'energetico-monster-absolutely-zero-473ml',
                produto_tipo: null,
                vlr_ini: '9.95',
                vlr_fim: '7.95',
                vlr_fim_somado: 23.85,
                filial_id: null,
                is_desc: true,
                desconto_id: 49440780,
                desconto_nm_descritivo: 'Leve Mais por Menos',
                dat_fim_timer: '',
                qtd_restante: null,
                descontoprodutopreco_id: 55791986,
                is_desconto_invisivel: null,
                imagem_selo: null,
                tipo_desc: 'agrupadoJuntoValor',
                imagem_desc:
                  'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                is_label_desc: false,
                cor_desc: 'ee3a41',
                cor_hover_desc: 'd7343b',
                descricao_html:
                  '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                descricao_botao_html:
                  '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                descricao_botao_padrao_html: 'Comprar',
                per_desc: '20.10',
                vlr_desc: '2.00',
                qtd_ini_desc: 3,
                qtd_fim_desc: null,
                dat_ini_desc: '2024-02-01 03:00:00+00:00',
                dat_fim_desc: '2024-03-01 03:00:00+00:00',
                cd_produto_final_id: null,
                cd_produto_final_nome: null,
                cd_produto_final_url: null,
                referencia: 7.95,
                hash: 'NTQzNTRfXzExNTg4X181NTc5MTk4Ng==',
                tipo_clube: 'clube',
                is_retencao_receita: false,
                is_controlado: false,
                qtd_limite: null,
                is_funcionario: true,
                produto_is_funcionario: false,
              },
            },
          ],
        },
      },
      componente_cliente: {
        grid: 'col-12',
        tipo: 'carrossel-produtos',
        label: 'Campanha',
        configuracao: {
          showIndicators: false,
          showNavigators: false,
          qtd_desktop: 5,
          qtd_mobile: 3,
          produtos: [
            {
              produto_id: '54354',
              ean: '070847022305',
              nome: 'Energético Monster Absolutely Zero 473ml',
              descricao: '',
              imagem:
                'https://vendamais.nisseilabs.com.br/media/produtos/54354_200x200_6yYvjEd.jpg',
              tipo_produto: null,
              marca: 'MONSTER',
              preco: {
                clube_id: 'publico',
                produto_id: '54354',
                produtopreco_id: 11588,
                is_disponivel: true,
                produto_url: 'energetico-monster-absolutely-zero-473ml',
                produto_tipo: null,
                vlr_ini: '9.95',
                vlr_fim: '7.95',
                vlr_fim_somado: 23.85,
                filial_id: null,
                is_desc: true,
                desconto_id: 49440780,
                desconto_nm_descritivo: 'Leve Mais por Menos',
                dat_fim_timer: '',
                qtd_restante: null,
                descontoprodutopreco_id: 55791986,
                is_desconto_invisivel: null,
                imagem_selo: null,
                tipo_desc: 'agrupadoJuntoValor',
                imagem_desc:
                  'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                is_label_desc: false,
                cor_desc: 'ee3a41',
                cor_hover_desc: 'd7343b',
                descricao_html:
                  '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                descricao_botao_html:
                  '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                descricao_botao_padrao_html: 'Comprar',
                per_desc: '20.10',
                vlr_desc: '2.00',
                qtd_ini_desc: 3,
                qtd_fim_desc: null,
                dat_ini_desc: '2024-02-01 03:00:00+00:00',
                dat_fim_desc: '2024-03-01 03:00:00+00:00',
                cd_produto_final_id: null,
                cd_produto_final_nome: null,
                cd_produto_final_url: null,
                referencia: 7.95,
                hash: 'NTQzNTRfXzExNTg4X181NTc5MTk4Ng==',
                tipo_clube: 'clube',
                is_retencao_receita: false,
                is_controlado: false,
                qtd_limite: null,
                is_funcionario: true,
                produto_is_funcionario: false,
              },
            },
            {
              produto_id: '54354',
              ean: '070847022305',
              nome: 'Energético Monster Absolutely Zero 473ml',
              descricao: '',
              imagem:
                'https://vendamais.nisseilabs.com.br/media/produtos/54354_200x200_6yYvjEd.jpg',
              tipo_produto: null,
              marca: 'MONSTER',
              preco: {
                clube_id: 'publico',
                produto_id: '54354',
                produtopreco_id: 11588,
                is_disponivel: true,
                produto_url: 'energetico-monster-absolutely-zero-473ml',
                produto_tipo: null,
                vlr_ini: '9.95',
                vlr_fim: '7.95',
                vlr_fim_somado: 23.85,
                filial_id: null,
                is_desc: true,
                desconto_id: 49440780,
                desconto_nm_descritivo: 'Leve Mais por Menos',
                dat_fim_timer: '',
                qtd_restante: null,
                descontoprodutopreco_id: 55791986,
                is_desconto_invisivel: null,
                imagem_selo: null,
                tipo_desc: 'agrupadoJuntoValor',
                imagem_desc:
                  'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                is_label_desc: false,
                cor_desc: 'ee3a41',
                cor_hover_desc: 'd7343b',
                descricao_html:
                  '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                descricao_botao_html:
                  '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                descricao_botao_padrao_html: 'Comprar',
                per_desc: '20.10',
                vlr_desc: '2.00',
                qtd_ini_desc: 3,
                qtd_fim_desc: null,
                dat_ini_desc: '2024-02-01 03:00:00+00:00',
                dat_fim_desc: '2024-03-01 03:00:00+00:00',
                cd_produto_final_id: null,
                cd_produto_final_nome: null,
                cd_produto_final_url: null,
                referencia: 7.95,
                hash: 'NTQzNTRfXzExNTg4X181NTc5MTk4Ng==',
                tipo_clube: 'clube',
                is_retencao_receita: false,
                is_controlado: false,
                qtd_limite: null,
                is_funcionario: true,
                produto_is_funcionario: false,
              },
            },
            {
              produto_id: '29070',
              ean: '07622210673831',
              nome: 'Chocolate Lacta Ao Leite 80g',
              descricao:
                '<p><span style="font-family: Arial;"><b></b></span><font face="Arial"><b>Chocolate Lacta Ao Leite</b><br></font></p><p><font face="Arial"><br></font></p><p><font face="Arial">Acrescente um toque de sabor todo especial ao seu dia a dia com a saborosíssima Barra de Chocolate Ao Leite Lacta 90g. Elaborada com ingredientes selecionados é extremamente saborosos. É a escolha perfeita para alegrar o seu dia. Aproveite e adquira já o seu nas <b>Farmácias Nissei</b>.</font></p>',
              imagem:
                'https://vendamais.nisseilabs.com.br/media/produtos/29070_1200x1200_1rOyNfn.webp',
              tipo_produto: null,
              marca: 'LACTA',
              preco: {
                filial: 23,
                produto_id: '29070',
                lista_id: 170,
                lista_nome: 'preco_base_loja_023',
                lista_clube: 'filial',
                vlr_ini: '6.95',
                produto_nome: 'Chocolate Lacta Ao Leite 80g',
                produto_selo: 'produtos/selos/selo_semana[1].webp',
                produto_is_controlado: false,
                produto_is_disponivel: true,
                desconto_id: 49573031,
                qtd_ini_desc: 2,
                qtd_fim_desc: null,
                desconto_valor: '2.20',
                desconto_percentual: null,
                desconto_valor_referencia: null,
                desconto_produto_brinde: null,
                dat_fim_timer: null,
                qtd_restante: null,
                desconto_tipo_id: 'agrupadoJuntoValor',
                desconto_cor: 'ee3a41',
                desconto_cor_hover: 'd7343b',
                desconto_botao_html:
                  '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                desconto_botao_padrao_html: 'Comprar',
                desconto_html:
                  '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                desconto_agrupamento: 'maispormenos',
                desconto_tipo: 'valor',
                desconto_is_label: false,
                desconto_imagem:
                  'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                desconto_is_sempre_invisivel: false,
                progressao_quantidade: null,
                progressao_valor_desconto: null,
                progressao_percentual_desconto: null,
                progressao_valor_final: null,
                progressao_qtd_limite: null,
                valor_referencia_inicial: '6.95',
                vlr_fim: '4.75',
                referencia: 4.75,
                is_desconto: true,
                dat_ini_lista: '1900-01-01',
                dat_fim_lista: '2999-12-31',
                dat_ini_preco: null,
                dat_fim_preco: null,
                dat_ini_desconto: '2024-02-01T03:00:00Z',
                dat_fim_desconto: '2024-03-01T03:00:00Z',
                status_lista: true,
                status_preco: true,
                status_relacao: true,
                status_desconto: true,
                status_progressao: null,
              },
            },
            {
              produto_id: '122085',
              ean: '07894900011715',
              nome: 'Refrigerante Coca-Cola Pet 1 Litro',
              descricao:
                '<p><span style="font-family: Arial;"><b></b></span><font face="Arial"><b>Refrigerante Coca-Cola</b><br></font></p><p><font face="Arial"><br></font></p><p><font face="Arial">Com sabor inconfundível e único, a Coca-Cola é o refrigerante mais tradicional e consumido no mundo inteiro! Toda Coca-Cola é produzida especialmente para manter sempre a qualidade do melhor sabor de refrigerante! Uma garrafa de Coca-Cola é perfeita para compartilhar os melhores momentos da vida com amigos e familiares! Não deixe de conferir todos os produtos Coca-Cola nas <b>Farmácias Nissei</b>.</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Ingredientes:&nbsp;</b></font></p><p><font face="Arial">Água gaseificada, açúcar, extrato de noz de cola, cafeína, corante caramelo IV, acidulante ácido fosfórico e aroma natural.</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Advertência:</b></font></p><p><font face="Arial">Conservar em local fresco, seco e ao abrigo de luz.</font></p><p><font face="Arial">Antes de consumir verifique a data de validade.</font></p><p><font face="Arial">Não consumir caso a embalagem esteja violada.</font></p><p><font face="Arial"></font></p>',
              imagem:
                'https://vendamais.nisseilabs.com.br/media/produtos/122085_1200x1200.jpg',
              tipo_produto: null,
              marca: 'COCA COLA',
              preco: {
                vlr_fim: 8.95,
              },
            },
            {
              produto_id: '645821',
              ean: '07894900700015',
              nome: 'Refrigerante Coca-Cola Sem Açúcar Lata 350ml',
              imagem:
                'https://vendamais.nisseilabs.com.br/media/produtos/645821_1200x1200_enPI8Nc.webp',
              descricao:
                '<p><span style="font-family: Arial;"><b></b></span><font face="Arial"><b>Refrigerante Coca-Cola Sem Açúcar</b><br></font></p><p><font face="Arial"><br></font></p><p><font face="Arial">A Coca-Cola Sem Açúcar é um refrigerante que não contém calorias! Com certeza você já se perguntou: Então, de onde vem aquele gostinho doce? A Coca-Cola Zero é produzida especialmente com adoçantes para manter o delicioso sabor de Coca-Cola porém com 0% açucar! Toda Coca-Cola é produzida especialmente para manter sempre a qualidade do melhor sabor de refrigerante! Uma garrafa de Coca-Cola é perfeita para compartilhar os melhores momentos da vida com amigos e familiares! Não deixe de conferir todos os produtos Coca-Cola nas <b>Farmácias Nissei</b>.</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Ingredientes:&nbsp;</b></font></p><p><font face="Arial">Água gaseificada, extrato de noz de cola, cafeína, aroma natural, corante caramelo IV, acidulante ácido fosfórico, edulcorantes ciclamato de sódio (27 mg), acesulfame de potássio (15 mg) e aspartame (12 mg) por 100 ml, conservador benzoato de sódio, regulador de acidez citrato de sódio. Contém Fenilalanina.&nbsp;</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Advertência:&nbsp;&nbsp;</b></font></p><p><font face="Arial">Conservar em local fresco, seco e ao abrigo de luz.&nbsp;</font></p><p><font face="Arial">Antes de consumir verifique a data de validade.</font></p><p><font face="Arial">Não consumir caso a embalagem esteja violada.&nbsp;</font></p>',
              tipo_produto: null,
              marca: 'COCA COLA',
              preco: {
                filial: 23,
                produto_id: '645821',
                lista_id: 170,
                lista_nome: 'preco_base_loja_023',
                lista_clube: 'filial',
                vlr_ini: '5.50',
                produto_nome: 'Refrigerante Coca-Cola Sem Açúcar Lata 350ml',
                produto_selo: 'produtos/selos/selo_semana[1].webp',
                produto_is_controlado: false,
                produto_is_disponivel: true,
                desconto_id: 52047997,
                qtd_ini_desc: 2,
                qtd_fim_desc: null,
                desconto_valor: '2.50',
                desconto_percentual: null,
                desconto_valor_referencia: null,
                desconto_produto_brinde: null,
                dat_fim_timer: null,
                qtd_restante: null,
                desconto_tipo_id: 'agrupadoJuntoValor',
                desconto_cor: 'ee3a41',
                desconto_cor_hover: 'd7343b',
                desconto_botao_html:
                  '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                desconto_botao_padrao_html: 'Comprar',
                desconto_html:
                  '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                desconto_agrupamento: 'maispormenos',
                desconto_tipo: 'valor',
                desconto_is_label: false,
                desconto_imagem:
                  'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                desconto_is_sempre_invisivel: false,
                progressao_quantidade: null,
                progressao_valor_desconto: null,
                progressao_percentual_desconto: null,
                progressao_valor_final: null,
                progressao_qtd_limite: null,
                valor_referencia_inicial: '5.50',
                vlr_fim: '3.00',
                referencia: 3,
                is_desconto: true,
                dat_ini_lista: '1900-01-01',
                dat_fim_lista: '2999-12-31',
                dat_ini_preco: null,
                dat_fim_preco: null,
                dat_ini_desconto: '2024-02-01T03:00:00Z',
                dat_fim_desconto: '2024-03-01T03:00:00Z',
                status_lista: true,
                status_preco: true,
                status_relacao: true,
                status_desconto: true,
                status_progressao: null,
              },
            }
          ],
        },
      }
    });
    return this.http.get<any>(`${this.API_ONLINE}produtos/club`);
  }

  buscarComponentesProdutosSugeridos(dados): Observable<any> {
    return of({
      status: true,
      componentes: [
        {
          grid: 'col-12 md:col-6',
          tipo: 'carrossel-produtos',
          label: 'Encarte',
          configuracao: {
            showIndicators: false,
            showNavigators: false,
            qtd_desktop: 3,
            qtd_mobile: 3,
            produtos: [
              {
                produto_id: '645821',
                ean: '07894900700015',
                nome: 'Refrigerante Coca-Cola Sem Açúcar Lata 350ml',
                imagem:
                  'https://vendamais.nisseilabs.com.br/media/produtos/645821_1200x1200_enPI8Nc.webp',
                descricao:
                  '<p><span style="font-family: Arial;"><b></b></span><font face="Arial"><b>Refrigerante Coca-Cola Sem Açúcar</b><br></font></p><p><font face="Arial"><br></font></p><p><font face="Arial">A Coca-Cola Sem Açúcar é um refrigerante que não contém calorias! Com certeza você já se perguntou: Então, de onde vem aquele gostinho doce? A Coca-Cola Zero é produzida especialmente com adoçantes para manter o delicioso sabor de Coca-Cola porém com 0% açucar! Toda Coca-Cola é produzida especialmente para manter sempre a qualidade do melhor sabor de refrigerante! Uma garrafa de Coca-Cola é perfeita para compartilhar os melhores momentos da vida com amigos e familiares! Não deixe de conferir todos os produtos Coca-Cola nas <b>Farmácias Nissei</b>.</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Ingredientes:&nbsp;</b></font></p><p><font face="Arial">Água gaseificada, extrato de noz de cola, cafeína, aroma natural, corante caramelo IV, acidulante ácido fosfórico, edulcorantes ciclamato de sódio (27 mg), acesulfame de potássio (15 mg) e aspartame (12 mg) por 100 ml, conservador benzoato de sódio, regulador de acidez citrato de sódio. Contém Fenilalanina.&nbsp;</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Advertência:&nbsp;&nbsp;</b></font></p><p><font face="Arial">Conservar em local fresco, seco e ao abrigo de luz.&nbsp;</font></p><p><font face="Arial">Antes de consumir verifique a data de validade.</font></p><p><font face="Arial">Não consumir caso a embalagem esteja violada.&nbsp;</font></p>',
                tipo_produto: null,
                marca: 'COCA COLA',
                preco: {
                  filial: 23,
                  produto_id: '645821',
                  lista_id: 170,
                  lista_nome: 'preco_base_loja_023',
                  lista_clube: 'filial',
                  vlr_ini: '5.50',
                  produto_nome: 'Refrigerante Coca-Cola Sem Açúcar Lata 350ml',
                  produto_selo: 'produtos/selos/selo_semana[1].webp',
                  produto_is_controlado: false,
                  produto_is_disponivel: true,
                  desconto_id: 52047997,
                  qtd_ini_desc: 2,
                  qtd_fim_desc: null,
                  desconto_valor: '2.50',
                  desconto_percentual: null,
                  desconto_valor_referencia: null,
                  desconto_produto_brinde: null,
                  dat_fim_timer: null,
                  qtd_restante: null,
                  desconto_tipo_id: 'agrupadoJuntoValor',
                  desconto_cor: 'ee3a41',
                  desconto_cor_hover: 'd7343b',
                  desconto_botao_html:
                    '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                  desconto_botao_padrao_html: 'Comprar',
                  desconto_html:
                    '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                  desconto_agrupamento: 'maispormenos',
                  desconto_tipo: 'valor',
                  desconto_is_label: false,
                  desconto_imagem:
                    'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                  desconto_is_sempre_invisivel: false,
                  progressao_quantidade: null,
                  progressao_valor_desconto: null,
                  progressao_percentual_desconto: null,
                  progressao_valor_final: null,
                  progressao_qtd_limite: null,
                  valor_referencia_inicial: '5.50',
                  vlr_fim: '3.00',
                  referencia: 3,
                  is_desconto: true,
                  dat_ini_lista: '1900-01-01',
                  dat_fim_lista: '2999-12-31',
                  dat_ini_preco: null,
                  dat_fim_preco: null,
                  dat_ini_desconto: '2024-02-01T03:00:00Z',
                  dat_fim_desconto: '2024-03-01T03:00:00Z',
                  status_lista: true,
                  status_preco: true,
                  status_relacao: true,
                  status_desconto: true,
                  status_progressao: null,
                },
              },
              {
                produto_id: '122085',
                ean: '07894900011715',
                nome: 'Refrigerante Coca-Cola Pet 1 Litro',
                descricao:
                  '<p><span style="font-family: Arial;"><b></b></span><font face="Arial"><b>Refrigerante Coca-Cola</b><br></font></p><p><font face="Arial"><br></font></p><p><font face="Arial">Com sabor inconfundível e único, a Coca-Cola é o refrigerante mais tradicional e consumido no mundo inteiro! Toda Coca-Cola é produzida especialmente para manter sempre a qualidade do melhor sabor de refrigerante! Uma garrafa de Coca-Cola é perfeita para compartilhar os melhores momentos da vida com amigos e familiares! Não deixe de conferir todos os produtos Coca-Cola nas <b>Farmácias Nissei</b>.</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Ingredientes:&nbsp;</b></font></p><p><font face="Arial">Água gaseificada, açúcar, extrato de noz de cola, cafeína, corante caramelo IV, acidulante ácido fosfórico e aroma natural.</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Advertência:</b></font></p><p><font face="Arial">Conservar em local fresco, seco e ao abrigo de luz.</font></p><p><font face="Arial">Antes de consumir verifique a data de validade.</font></p><p><font face="Arial">Não consumir caso a embalagem esteja violada.</font></p><p><font face="Arial"></font></p>',
                imagem:
                  'https://vendamais.nisseilabs.com.br/media/produtos/122085_1200x1200.jpg',
                tipo_produto: null,
                marca: 'COCA COLA',
                preco: {
                  vlr_fim: 8.95,
                },
              },
              {
                produto_id: '29070',
                ean: '07622210673831',
                nome: 'Chocolate Lacta Ao Leite 80g',
                descricao:
                  '<p><span style="font-family: Arial;"><b></b></span><font face="Arial"><b>Chocolate Lacta Ao Leite</b><br></font></p><p><font face="Arial"><br></font></p><p><font face="Arial">Acrescente um toque de sabor todo especial ao seu dia a dia com a saborosíssima Barra de Chocolate Ao Leite Lacta 90g. Elaborada com ingredientes selecionados é extremamente saborosos. É a escolha perfeita para alegrar o seu dia. Aproveite e adquira já o seu nas <b>Farmácias Nissei</b>.</font></p>',
                imagem:
                  'https://vendamais.nisseilabs.com.br/media/produtos/29070_1200x1200_1rOyNfn.webp',
                tipo_produto: null,
                marca: 'LACTA',
                preco: {
                  filial: 23,
                  produto_id: '29070',
                  lista_id: 170,
                  lista_nome: 'preco_base_loja_023',
                  lista_clube: 'filial',
                  vlr_ini: '6.95',
                  produto_nome: 'Chocolate Lacta Ao Leite 80g',
                  produto_selo: 'produtos/selos/selo_semana[1].webp',
                  produto_is_controlado: false,
                  produto_is_disponivel: true,
                  desconto_id: 49573031,
                  qtd_ini_desc: 2,
                  qtd_fim_desc: null,
                  desconto_valor: '2.20',
                  desconto_percentual: null,
                  desconto_valor_referencia: null,
                  desconto_produto_brinde: null,
                  dat_fim_timer: null,
                  qtd_restante: null,
                  desconto_tipo_id: 'agrupadoJuntoValor',
                  desconto_cor: 'ee3a41',
                  desconto_cor_hover: 'd7343b',
                  desconto_botao_html:
                    '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                  desconto_botao_padrao_html: 'Comprar',
                  desconto_html:
                    '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                  desconto_agrupamento: 'maispormenos',
                  desconto_tipo: 'valor',
                  desconto_is_label: false,
                  desconto_imagem:
                    'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                  desconto_is_sempre_invisivel: false,
                  progressao_quantidade: null,
                  progressao_valor_desconto: null,
                  progressao_percentual_desconto: null,
                  progressao_valor_final: null,
                  progressao_qtd_limite: null,
                  valor_referencia_inicial: '6.95',
                  vlr_fim: '4.75',
                  referencia: 4.75,
                  is_desconto: true,
                  dat_ini_lista: '1900-01-01',
                  dat_fim_lista: '2999-12-31',
                  dat_ini_preco: null,
                  dat_fim_preco: null,
                  dat_ini_desconto: '2024-02-01T03:00:00Z',
                  dat_fim_desconto: '2024-03-01T03:00:00Z',
                  status_lista: true,
                  status_preco: true,
                  status_relacao: true,
                  status_desconto: true,
                  status_progressao: null,
                },
              },
              {
                produto_id: '54354',
                ean: '070847022305',
                nome: 'Energético Monster Absolutely Zero 473ml',
                descricao: '',
                imagem:
                  'https://vendamais.nisseilabs.com.br/media/produtos/54354_200x200_6yYvjEd.jpg',
                tipo_produto: null,
                marca: 'MONSTER',
                preco: {
                  clube_id: 'publico',
                  produto_id: '54354',
                  produtopreco_id: 11588,
                  is_disponivel: true,
                  produto_url: 'energetico-monster-absolutely-zero-473ml',
                  produto_tipo: null,
                  vlr_ini: '9.95',
                  vlr_fim: '7.95',
                  vlr_fim_somado: 23.85,
                  filial_id: null,
                  is_desc: true,
                  desconto_id: 49440780,
                  desconto_nm_descritivo: 'Leve Mais por Menos',
                  dat_fim_timer: '',
                  qtd_restante: null,
                  descontoprodutopreco_id: 55791986,
                  is_desconto_invisivel: null,
                  imagem_selo: null,
                  tipo_desc: 'agrupadoJuntoValor',
                  imagem_desc:
                    'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                  is_label_desc: false,
                  cor_desc: 'ee3a41',
                  cor_hover_desc: 'd7343b',
                  descricao_html:
                    '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                  descricao_botao_html:
                    '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                  descricao_botao_padrao_html: 'Comprar',
                  per_desc: '20.10',
                  vlr_desc: '2.00',
                  qtd_ini_desc: 3,
                  qtd_fim_desc: null,
                  dat_ini_desc: '2024-02-01 03:00:00+00:00',
                  dat_fim_desc: '2024-03-01 03:00:00+00:00',
                  cd_produto_final_id: null,
                  cd_produto_final_nome: null,
                  cd_produto_final_url: null,
                  referencia: 7.95,
                  hash: 'NTQzNTRfXzExNTg4X181NTc5MTk4Ng==',
                  tipo_clube: 'clube',
                  is_retencao_receita: false,
                  is_controlado: false,
                  qtd_limite: null,
                  is_funcionario: true,
                  produto_is_funcionario: false,
                },
              },
              {
                produto_id: '54354',
                ean: '070847022305',
                nome: 'Energético Monster Absolutely Zero 473ml',
                descricao: '',
                imagem:
                  'https://vendamais.nisseilabs.com.br/media/produtos/54354_200x200_6yYvjEd.jpg',
                tipo_produto: null,
                marca: 'MONSTER',
                preco: {
                  clube_id: 'publico',
                  produto_id: '54354',
                  produtopreco_id: 11588,
                  is_disponivel: true,
                  produto_url: 'energetico-monster-absolutely-zero-473ml',
                  produto_tipo: null,
                  vlr_ini: '9.95',
                  vlr_fim: '7.95',
                  vlr_fim_somado: 23.85,
                  filial_id: null,
                  is_desc: true,
                  desconto_id: 49440780,
                  desconto_nm_descritivo: 'Leve Mais por Menos',
                  dat_fim_timer: '',
                  qtd_restante: null,
                  descontoprodutopreco_id: 55791986,
                  is_desconto_invisivel: null,
                  imagem_selo: null,
                  tipo_desc: 'agrupadoJuntoValor',
                  imagem_desc:
                    'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                  is_label_desc: false,
                  cor_desc: 'ee3a41',
                  cor_hover_desc: 'd7343b',
                  descricao_html:
                    '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                  descricao_botao_html:
                    '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                  descricao_botao_padrao_html: 'Comprar',
                  per_desc: '20.10',
                  vlr_desc: '2.00',
                  qtd_ini_desc: 3,
                  qtd_fim_desc: null,
                  dat_ini_desc: '2024-02-01 03:00:00+00:00',
                  dat_fim_desc: '2024-03-01 03:00:00+00:00',
                  cd_produto_final_id: null,
                  cd_produto_final_nome: null,
                  cd_produto_final_url: null,
                  referencia: 7.95,
                  hash: 'NTQzNTRfXzExNTg4X181NTc5MTk4Ng==',
                  tipo_clube: 'clube',
                  is_retencao_receita: false,
                  is_controlado: false,
                  qtd_limite: null,
                  is_funcionario: true,
                  produto_is_funcionario: false,
                },
              },
            ],
          },
        },
        {
          grid: 'col-12 md:col-6',
          tipo: 'carrossel-produtos',
          label: 'Campanha',
          configuracao: {
            showIndicators: false,
            showNavigators: false,
            qtd_desktop: 3,
            qtd_mobile: 3,
            produtos: [
              {
                produto_id: '54354',
                ean: '070847022305',
                nome: 'Energético Monster Absolutely Zero 473ml',
                descricao: '',
                imagem:
                  'https://vendamais.nisseilabs.com.br/media/produtos/54354_200x200_6yYvjEd.jpg',
                tipo_produto: null,
                marca: 'MONSTER',
                preco: {
                  clube_id: 'publico',
                  produto_id: '54354',
                  produtopreco_id: 11588,
                  is_disponivel: true,
                  produto_url: 'energetico-monster-absolutely-zero-473ml',
                  produto_tipo: null,
                  vlr_ini: '9.95',
                  vlr_fim: '7.95',
                  vlr_fim_somado: 23.85,
                  filial_id: null,
                  is_desc: true,
                  desconto_id: 49440780,
                  desconto_nm_descritivo: 'Leve Mais por Menos',
                  dat_fim_timer: '',
                  qtd_restante: null,
                  descontoprodutopreco_id: 55791986,
                  is_desconto_invisivel: null,
                  imagem_selo: null,
                  tipo_desc: 'agrupadoJuntoValor',
                  imagem_desc:
                    'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                  is_label_desc: false,
                  cor_desc: 'ee3a41',
                  cor_hover_desc: 'd7343b',
                  descricao_html:
                    '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                  descricao_botao_html:
                    '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                  descricao_botao_padrao_html: 'Comprar',
                  per_desc: '20.10',
                  vlr_desc: '2.00',
                  qtd_ini_desc: 3,
                  qtd_fim_desc: null,
                  dat_ini_desc: '2024-02-01 03:00:00+00:00',
                  dat_fim_desc: '2024-03-01 03:00:00+00:00',
                  cd_produto_final_id: null,
                  cd_produto_final_nome: null,
                  cd_produto_final_url: null,
                  referencia: 7.95,
                  hash: 'NTQzNTRfXzExNTg4X181NTc5MTk4Ng==',
                  tipo_clube: 'clube',
                  is_retencao_receita: false,
                  is_controlado: false,
                  qtd_limite: null,
                  is_funcionario: true,
                  produto_is_funcionario: false,
                },
              },
              {
                produto_id: '54354',
                ean: '070847022305',
                nome: 'Energético Monster Absolutely Zero 473ml',
                descricao: '',
                imagem:
                  'https://vendamais.nisseilabs.com.br/media/produtos/54354_200x200_6yYvjEd.jpg',
                tipo_produto: null,
                marca: 'MONSTER',
                preco: {
                  clube_id: 'publico',
                  produto_id: '54354',
                  produtopreco_id: 11588,
                  is_disponivel: true,
                  produto_url: 'energetico-monster-absolutely-zero-473ml',
                  produto_tipo: null,
                  vlr_ini: '9.95',
                  vlr_fim: '7.95',
                  vlr_fim_somado: 23.85,
                  filial_id: null,
                  is_desc: true,
                  desconto_id: 49440780,
                  desconto_nm_descritivo: 'Leve Mais por Menos',
                  dat_fim_timer: '',
                  qtd_restante: null,
                  descontoprodutopreco_id: 55791986,
                  is_desconto_invisivel: null,
                  imagem_selo: null,
                  tipo_desc: 'agrupadoJuntoValor',
                  imagem_desc:
                    'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                  is_label_desc: false,
                  cor_desc: 'ee3a41',
                  cor_hover_desc: 'd7343b',
                  descricao_html:
                    '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                  descricao_botao_html:
                    '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                  descricao_botao_padrao_html: 'Comprar',
                  per_desc: '20.10',
                  vlr_desc: '2.00',
                  qtd_ini_desc: 3,
                  qtd_fim_desc: null,
                  dat_ini_desc: '2024-02-01 03:00:00+00:00',
                  dat_fim_desc: '2024-03-01 03:00:00+00:00',
                  cd_produto_final_id: null,
                  cd_produto_final_nome: null,
                  cd_produto_final_url: null,
                  referencia: 7.95,
                  hash: 'NTQzNTRfXzExNTg4X181NTc5MTk4Ng==',
                  tipo_clube: 'clube',
                  is_retencao_receita: false,
                  is_controlado: false,
                  qtd_limite: null,
                  is_funcionario: true,
                  produto_is_funcionario: false,
                },
              },
              {
                produto_id: '29070',
                ean: '07622210673831',
                nome: 'Chocolate Lacta Ao Leite 80g',
                descricao:
                  '<p><span style="font-family: Arial;"><b></b></span><font face="Arial"><b>Chocolate Lacta Ao Leite</b><br></font></p><p><font face="Arial"><br></font></p><p><font face="Arial">Acrescente um toque de sabor todo especial ao seu dia a dia com a saborosíssima Barra de Chocolate Ao Leite Lacta 90g. Elaborada com ingredientes selecionados é extremamente saborosos. É a escolha perfeita para alegrar o seu dia. Aproveite e adquira já o seu nas <b>Farmácias Nissei</b>.</font></p>',
                imagem:
                  'https://vendamais.nisseilabs.com.br/media/produtos/29070_1200x1200_1rOyNfn.webp',
                tipo_produto: null,
                marca: 'LACTA',
                preco: {
                  filial: 23,
                  produto_id: '29070',
                  lista_id: 170,
                  lista_nome: 'preco_base_loja_023',
                  lista_clube: 'filial',
                  vlr_ini: '6.95',
                  produto_nome: 'Chocolate Lacta Ao Leite 80g',
                  produto_selo: 'produtos/selos/selo_semana[1].webp',
                  produto_is_controlado: false,
                  produto_is_disponivel: true,
                  desconto_id: 49573031,
                  qtd_ini_desc: 2,
                  qtd_fim_desc: null,
                  desconto_valor: '2.20',
                  desconto_percentual: null,
                  desconto_valor_referencia: null,
                  desconto_produto_brinde: null,
                  dat_fim_timer: null,
                  qtd_restante: null,
                  desconto_tipo_id: 'agrupadoJuntoValor',
                  desconto_cor: 'ee3a41',
                  desconto_cor_hover: 'd7343b',
                  desconto_botao_html:
                    '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                  desconto_botao_padrao_html: 'Comprar',
                  desconto_html:
                    '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                  desconto_agrupamento: 'maispormenos',
                  desconto_tipo: 'valor',
                  desconto_is_label: false,
                  desconto_imagem:
                    'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                  desconto_is_sempre_invisivel: false,
                  progressao_quantidade: null,
                  progressao_valor_desconto: null,
                  progressao_percentual_desconto: null,
                  progressao_valor_final: null,
                  progressao_qtd_limite: null,
                  valor_referencia_inicial: '6.95',
                  vlr_fim: '4.75',
                  referencia: 4.75,
                  is_desconto: true,
                  dat_ini_lista: '1900-01-01',
                  dat_fim_lista: '2999-12-31',
                  dat_ini_preco: null,
                  dat_fim_preco: null,
                  dat_ini_desconto: '2024-02-01T03:00:00Z',
                  dat_fim_desconto: '2024-03-01T03:00:00Z',
                  status_lista: true,
                  status_preco: true,
                  status_relacao: true,
                  status_desconto: true,
                  status_progressao: null,
                },
              },
              {
                produto_id: '122085',
                ean: '07894900011715',
                nome: 'Refrigerante Coca-Cola Pet 1 Litro',
                descricao:
                  '<p><span style="font-family: Arial;"><b></b></span><font face="Arial"><b>Refrigerante Coca-Cola</b><br></font></p><p><font face="Arial"><br></font></p><p><font face="Arial">Com sabor inconfundível e único, a Coca-Cola é o refrigerante mais tradicional e consumido no mundo inteiro! Toda Coca-Cola é produzida especialmente para manter sempre a qualidade do melhor sabor de refrigerante! Uma garrafa de Coca-Cola é perfeita para compartilhar os melhores momentos da vida com amigos e familiares! Não deixe de conferir todos os produtos Coca-Cola nas <b>Farmácias Nissei</b>.</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Ingredientes:&nbsp;</b></font></p><p><font face="Arial">Água gaseificada, açúcar, extrato de noz de cola, cafeína, corante caramelo IV, acidulante ácido fosfórico e aroma natural.</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Advertência:</b></font></p><p><font face="Arial">Conservar em local fresco, seco e ao abrigo de luz.</font></p><p><font face="Arial">Antes de consumir verifique a data de validade.</font></p><p><font face="Arial">Não consumir caso a embalagem esteja violada.</font></p><p><font face="Arial"></font></p>',
                imagem:
                  'https://vendamais.nisseilabs.com.br/media/produtos/122085_1200x1200.jpg',
                tipo_produto: null,
                marca: 'COCA COLA',
                preco: {
                  vlr_fim: 8.95,
                },
              },
              {
                produto_id: '645821',
                ean: '07894900700015',
                nome: 'Refrigerante Coca-Cola Sem Açúcar Lata 350ml',
                imagem:
                  'https://vendamais.nisseilabs.com.br/media/produtos/645821_1200x1200_enPI8Nc.webp',
                descricao:
                  '<p><span style="font-family: Arial;"><b></b></span><font face="Arial"><b>Refrigerante Coca-Cola Sem Açúcar</b><br></font></p><p><font face="Arial"><br></font></p><p><font face="Arial">A Coca-Cola Sem Açúcar é um refrigerante que não contém calorias! Com certeza você já se perguntou: Então, de onde vem aquele gostinho doce? A Coca-Cola Zero é produzida especialmente com adoçantes para manter o delicioso sabor de Coca-Cola porém com 0% açucar! Toda Coca-Cola é produzida especialmente para manter sempre a qualidade do melhor sabor de refrigerante! Uma garrafa de Coca-Cola é perfeita para compartilhar os melhores momentos da vida com amigos e familiares! Não deixe de conferir todos os produtos Coca-Cola nas <b>Farmácias Nissei</b>.</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Ingredientes:&nbsp;</b></font></p><p><font face="Arial">Água gaseificada, extrato de noz de cola, cafeína, aroma natural, corante caramelo IV, acidulante ácido fosfórico, edulcorantes ciclamato de sódio (27 mg), acesulfame de potássio (15 mg) e aspartame (12 mg) por 100 ml, conservador benzoato de sódio, regulador de acidez citrato de sódio. Contém Fenilalanina.&nbsp;</font></p><p><font face="Arial"><br></font></p><p><font face="Arial"><b>Advertência:&nbsp;&nbsp;</b></font></p><p><font face="Arial">Conservar em local fresco, seco e ao abrigo de luz.&nbsp;</font></p><p><font face="Arial">Antes de consumir verifique a data de validade.</font></p><p><font face="Arial">Não consumir caso a embalagem esteja violada.&nbsp;</font></p>',
                tipo_produto: null,
                marca: 'COCA COLA',
                preco: {
                  filial: 23,
                  produto_id: '645821',
                  lista_id: 170,
                  lista_nome: 'preco_base_loja_023',
                  lista_clube: 'filial',
                  vlr_ini: '5.50',
                  produto_nome: 'Refrigerante Coca-Cola Sem Açúcar Lata 350ml',
                  produto_selo: 'produtos/selos/selo_semana[1].webp',
                  produto_is_controlado: false,
                  produto_is_disponivel: true,
                  desconto_id: 52047997,
                  qtd_ini_desc: 2,
                  qtd_fim_desc: null,
                  desconto_valor: '2.50',
                  desconto_percentual: null,
                  desconto_valor_referencia: null,
                  desconto_produto_brinde: null,
                  dat_fim_timer: null,
                  qtd_restante: null,
                  desconto_tipo_id: 'agrupadoJuntoValor',
                  desconto_cor: 'ee3a41',
                  desconto_cor_hover: 'd7343b',
                  desconto_botao_html:
                    '<span class="small font-weight-bold"> ${qtd_ini_desc} un </span>R$ ${vlr_fim} <span class="small font-weight-bold">cada</span>',
                  desconto_botao_padrao_html: 'Comprar',
                  desconto_html:
                    '<span class="d-flex" style="color:#a3a3a3; font-size:var(--textoPrecoSecundario);">1 por R$ ${vlr_ini} cada <p data-target="desconto-produto"></p></span> \r\n<p>\r\n    <span style="font-size:var(--textoPrecoSecundario);">${qtd_ini_desc} ou + por </span><span style="font-weight:800 !important; color:#3F84C7; font-size:var(--textoPrecoSecundario);">R$ ${vlr_fim}</span> <span style="font-size:var(--textoPrecoSecundario);">cada</span>\r\n</p>',
                  desconto_agrupamento: 'maispormenos',
                  desconto_tipo: 'valor',
                  desconto_is_label: false,
                  desconto_imagem:
                    'produtos/descontos/Selo_Mais_Por_Menos_y1XnP2V.webp',
                  desconto_is_sempre_invisivel: false,
                  progressao_quantidade: null,
                  progressao_valor_desconto: null,
                  progressao_percentual_desconto: null,
                  progressao_valor_final: null,
                  progressao_qtd_limite: null,
                  valor_referencia_inicial: '5.50',
                  vlr_fim: '3.00',
                  referencia: 3,
                  is_desconto: true,
                  dat_ini_lista: '1900-01-01',
                  dat_fim_lista: '2999-12-31',
                  dat_ini_preco: null,
                  dat_fim_preco: null,
                  dat_ini_desconto: '2024-02-01T03:00:00Z',
                  dat_fim_desconto: '2024-03-01T03:00:00Z',
                  status_lista: true,
                  status_preco: true,
                  status_relacao: true,
                  status_desconto: true,
                  status_progressao: null,
                },
              }
            ],
          },
        }
      ]
    });

    this.data = {
      ...dados,
    };

    return this.http.get<any>(`${this.API_ONLINE}produtos/sugeridos`);
  }

  buscarHistoricoPedido(dados): Observable<any> {
    return of({
      status: true,
      pedidos: [
        {
          "id": 130381401,
          "dat_insercao": "2024-02-05T14:37:05.292Z",
          "vlr_subtotal": "223.70",
          "vlr_entrega": "0.00",
          "vlr_desconto": "6.00",
          "vlr_desconto_pbm": "0.00",
          "vlr_total": "223.70",
          "hash": "ab19a601-3cae-40f7-971c-cb0d223deab1",
          "pagamento_id": 1435458,
          "pagamento__tipo__nm_descritivo": "NisseiPay",
          "pagamento__tipo_id": "cashback",
          "pagamento__url_externa": null,
          "pagamento__codigo_barras": null,
          "pagamento__cartao__bandeira_id": null,
          "pagamento__cartao__bandeira__imagem": null,
          "pagamento__cartao__bandeira__nm_descritivo": null,
          "pagamento__cartao__ultimos_4": null,
          "pagamento__codigo": "130381400",
          "pagamento__qr_code": "",
          "pagamento__informacao": null,
          "pagamento__convenio__nm_descritivo": null,
          "pagamento__redirect": null,
          "qtd_parcelas": 1,
          "vlr_total_parcelado": "223.70",
          "tipo_entrega_id": "retirada",
          "tipo_entrega__tipo_codigo": "retirada",
          "tipo_entrega__imagem": "ecommerce/icones/retirada.png",
          "tipo_entrega__nm_descritivo": "Retirada em Loja",
          "cd_filial__nome": "AV. IGUACU 24HRS",
          "is_retirado_terceiro": false,
          "retirado_terceiro_cpf": null,
          "retirado_terceiro_nome": null,
          "retirado_terceiro_telefone": null,
          "cd_filial__endereco": "IGUACU",
          "cd_filial__cep__endereco_cep": "Iguaçu",
          "cliente__nm_primeiro": "Nathanael",
          "cliente__nm_completo": "Nathanael Iung",
          "cd_filial__numero": "2619",
          "cd_filial__bairro": "AGUA VERDE",
          "cd_filial__cep__bairro_cep": null,
          "ultimo_status_id": "pedido_separacao",
          "ultimo_status__nome": "pedido_separacao",
          "ultimo_status__nm_descritivo": "Separação",
          "ultimo_status__is_valido": true,
          "cd_filial__cep__municipio__nome": "Curitiba",
          "cd_filial__cd_filial": 33,
          "cd_filial__parceiro__nome": null,
          "cd_filial__cep__municipio__uf__nm_abrev": "PR",
          "endereco_entrega__apelido": "Casa",
          "endereco_entrega__endereco": "Rua Padre Dehon",
          "endereco_entrega__cep__endereco_cep": "Padre Dehon",
          "endereco_entrega__numero": "2220",
          "endereco_entrega__bairro": "Boqueirão",
          "endereco_entrega__cep__bairro_cep": null,
          "endereco_entrega__cep__municipio__nome": "Curitiba",
          "endereco_entrega__cep__municipio__uf__nm_abrev": "PR",
          "local_entrega_id__nome": null,
          "local_entrega_id__endereco": null,
          "local_entrega_id__numero": null,
          "local_entrega_id__bairro": null,
          "local_entrega_id__responsavel": null,
          "local_entrega_id__cep_id": null,
          "vlr_cupom": "0.00",
          "cupom__codigo": null,
          "cupom__nome": null,
          "cupom__is_frete_gratis": null,
          "cupom_id": null,
          "nota_valor": null,
          "nota_observacao": null,
          "nota__numero": null,
          "nota__serie": null,
          "nota__chave": null,
          "nota__arquivo": null,
          "nota__xml": null,
          "cidade_agendamento__nome": null,
          "ultimo_status__ordem": 9,
          "ultimo_status__grupo": "separacao",
          "pedidoitem__id": "PEDIDO.STATUS.GRUPO",
          "pagamento__codigo_ifood": 4523894,
          "vlr_sem_desconto": null
        },
        {
          "id": 130381101,
          "dat_insercao": "2024-02-05T13:31:04.293Z",
          "vlr_subtotal": "124.76",
          "vlr_entrega": "0.00",
          "vlr_desconto": "0.00",
          "vlr_desconto_pbm": "0.00",
          "vlr_total": "124.76",
          "hash": "16e553c4-09ca-4a2d-ab6e-c80e230f74c8",
          "pagamento_id": 1435455,
          "pagamento__tipo__nm_descritivo": "NisseiPay",
          "pagamento__tipo_id": "cashback",
          "pagamento__url_externa": null,
          "pagamento__codigo_barras": null,
          "pagamento__cartao__bandeira_id": null,
          "pagamento__cartao__bandeira__imagem": null,
          "pagamento__cartao__bandeira__nm_descritivo": null,
          "pagamento__cartao__ultimos_4": null,
          "pagamento__codigo": "130381100",
          "pagamento__qr_code": "",
          "pagamento__informacao": null,
          "pagamento__convenio__nm_descritivo": null,
          "pagamento__redirect": null,
          "qtd_parcelas": 1,
          "vlr_total_parcelado": "124.76",
          "tipo_entrega_id": "retirada",
          "tipo_entrega__tipo_codigo": "retirada",
          "tipo_entrega__imagem": "ecommerce/icones/retirada.png",
          "tipo_entrega__nm_descritivo": "Retirada em Loja",
          "cd_filial__nome": "AV. IGUACU 24HRS",
          "is_retirado_terceiro": false,
          "retirado_terceiro_cpf": null,
          "retirado_terceiro_nome": null,
          "retirado_terceiro_telefone": null,
          "cd_filial__endereco": "IGUACU",
          "cd_filial__cep__endereco_cep": "Iguaçu",
          "cliente__nm_primeiro": "Nathanael",
          "cliente__nm_completo": "Nathanael Iung",
          "cd_filial__numero": "2619",
          "cd_filial__bairro": "AGUA VERDE",
          "cd_filial__cep__bairro_cep": null,
          "ultimo_status_id": "pedido_separacao",
          "ultimo_status__nome": "pedido_separacao",
          "ultimo_status__nm_descritivo": "Separação",
          "ultimo_status__is_valido": true,
          "cd_filial__cep__municipio__nome": "Curitiba",
          "cd_filial__cd_filial": 33,
          "cd_filial__parceiro__nome": null,
          "cd_filial__cep__municipio__uf__nm_abrev": "PR",
          "endereco_entrega__apelido": "Casa",
          "endereco_entrega__endereco": "Rua Padre Dehon",
          "endereco_entrega__cep__endereco_cep": "Padre Dehon",
          "endereco_entrega__numero": "2220",
          "endereco_entrega__bairro": "Boqueirão",
          "endereco_entrega__cep__bairro_cep": null,
          "endereco_entrega__cep__municipio__nome": "Curitiba",
          "endereco_entrega__cep__municipio__uf__nm_abrev": "PR",
          "local_entrega_id__nome": null,
          "local_entrega_id__endereco": null,
          "local_entrega_id__numero": null,
          "local_entrega_id__bairro": null,
          "local_entrega_id__responsavel": null,
          "local_entrega_id__cep_id": null,
          "vlr_cupom": "0.00",
          "cupom__codigo": null,
          "cupom__nome": null,
          "cupom__is_frete_gratis": null,
          "cupom_id": null,
          "nota_valor": null,
          "nota_observacao": null,
          "nota__numero": null,
          "nota__serie": null,
          "nota__chave": null,
          "nota__arquivo": null,
          "nota__xml": null,
          "cidade_agendamento__nome": null,
          "ultimo_status__ordem": 9,
          "ultimo_status__grupo": "separacao",
          "pedidoitem__id": "PEDIDO.STATUS.GRUPO",
          "pagamento__codigo_ifood": 4523886,
          "vlr_sem_desconto": null
        },
        {
          "id": 130371601,
          "dat_insercao": "2024-01-31T21:08:53.823Z",
          "vlr_subtotal": "0.00",
          "vlr_entrega": "0.00",
          "vlr_desconto": "0.00",
          "vlr_desconto_pbm": "0.00",
          "vlr_total": "0.00",
          "hash": "0743f712-10c2-4a3b-9775-d3ad40eea85c",
          "pagamento_id": null,
          "pagamento__tipo__nm_descritivo": null,
          "pagamento__tipo_id": null,
          "pagamento__url_externa": null,
          "pagamento__codigo_barras": null,
          "pagamento__cartao__bandeira_id": null,
          "pagamento__cartao__bandeira__imagem": null,
          "pagamento__cartao__bandeira__nm_descritivo": null,
          "pagamento__cartao__ultimos_4": null,
          "pagamento__codigo": null,
          "pagamento__qr_code": null,
          "pagamento__informacao": null,
          "pagamento__convenio__nm_descritivo": null,
          "pagamento__redirect": null,
          "qtd_parcelas": null,
          "vlr_total_parcelado": null,
          "tipo_entrega_id": "devolucao",
          "tipo_entrega__tipo_codigo": "entrega",
          "tipo_entrega__imagem": "",
          "tipo_entrega__nm_descritivo": "devolucao",
          "cd_filial__nome": "PORTAO 24HRS",
          "is_retirado_terceiro": false,
          "retirado_terceiro_cpf": null,
          "retirado_terceiro_nome": null,
          "retirado_terceiro_telefone": null,
          "cd_filial__endereco": "REPUBLICA ARGENTINA",
          "cd_filial__cep__endereco_cep": "República Argentina",
          "cliente__nm_primeiro": "Nathanael",
          "cliente__nm_completo": "Nathanael Iung",
          "cd_filial__numero": "2930",
          "cd_filial__bairro": "PORTAO",
          "cd_filial__cep__bairro_cep": null,
          "ultimo_status_id": "pedido_faturado",
          "ultimo_status__nome": "pedido_faturado",
          "ultimo_status__nm_descritivo": "Faturado",
          "ultimo_status__is_valido": true,
          "cd_filial__cep__municipio__nome": "Curitiba",
          "cd_filial__cd_filial": 23,
          "cd_filial__parceiro__nome": null,
          "cd_filial__cep__municipio__uf__nm_abrev": "PR",
          "endereco_entrega__apelido": null,
          "endereco_entrega__endereco": null,
          "endereco_entrega__cep__endereco_cep": null,
          "endereco_entrega__numero": null,
          "endereco_entrega__bairro": null,
          "endereco_entrega__cep__bairro_cep": null,
          "endereco_entrega__cep__municipio__nome": null,
          "endereco_entrega__cep__municipio__uf__nm_abrev": null,
          "local_entrega_id__nome": null,
          "local_entrega_id__endereco": null,
          "local_entrega_id__numero": null,
          "local_entrega_id__bairro": null,
          "local_entrega_id__responsavel": null,
          "local_entrega_id__cep_id": null,
          "vlr_cupom": "0.00",
          "cupom__codigo": null,
          "cupom__nome": null,
          "cupom__is_frete_gratis": null,
          "cupom_id": null,
          "nota_valor": null,
          "nota_observacao": null,
          "nota__numero": "689",
          "nota__serie": "282",
          "nota__chave": "8682",
          "nota__arquivo": "",
          "nota__xml": null,
          "cidade_agendamento__nome": null,
          "ultimo_status__ordem": 14,
          "ultimo_status__grupo": "faturamento",
          "pedidoitem__id": "PEDIDO.STATUS.GRUPO",
          "pagamento__codigo_ifood": 4523776,
          "vlr_sem_desconto": null
        },
        {
          "id": 130371501,
          "dat_insercao": "2024-01-31T21:00:32.448Z",
          "vlr_subtotal": "29.90",
          "vlr_entrega": "9.90",
          "vlr_desconto": "0.00",
          "vlr_desconto_pbm": "0.00",
          "vlr_total": "39.80",
          "hash": "6e035d82-380b-41d3-aaf6-c50c7bf82e6a",
          "pagamento_id": 1435392,
          "pagamento__tipo__nm_descritivo": "NisseiPay",
          "pagamento__tipo_id": "cashback",
          "pagamento__url_externa": null,
          "pagamento__codigo_barras": null,
          "pagamento__cartao__bandeira_id": null,
          "pagamento__cartao__bandeira__imagem": null,
          "pagamento__cartao__bandeira__nm_descritivo": null,
          "pagamento__cartao__ultimos_4": null,
          "pagamento__codigo": "130371500",
          "pagamento__qr_code": "",
          "pagamento__informacao": null,
          "pagamento__convenio__nm_descritivo": null,
          "pagamento__redirect": null,
          "qtd_parcelas": 1,
          "vlr_total_parcelado": "39.80",
          "tipo_entrega_id": "entrega",
          "tipo_entrega__tipo_codigo": "entrega",
          "tipo_entrega__imagem": "ecommerce/icones/entrega3.png",
          "tipo_entrega__nm_descritivo": "Entrega Express",
          "cd_filial__nome": "VILA HAUER 24HRS",
          "is_retirado_terceiro": false,
          "retirado_terceiro_cpf": null,
          "retirado_terceiro_nome": null,
          "retirado_terceiro_telefone": null,
          "cd_filial__endereco": "MARECHAL FLORIANO PEIXOTO",
          "cd_filial__cep__endereco_cep": "Marechal Floriano Peixoto",
          "cliente__nm_primeiro": "Nathanael",
          "cliente__nm_completo": "Nathanael Iung",
          "cd_filial__numero": "5666",
          "cd_filial__bairro": "HAUER",
          "cd_filial__cep__bairro_cep": null,
          "ultimo_status_id": "pedido_faturando",
          "ultimo_status__nome": "pedido_faturando",
          "ultimo_status__nm_descritivo": "Aguardando faturamento",
          "ultimo_status__is_valido": true,
          "cd_filial__cep__municipio__nome": "Curitiba",
          "cd_filial__cd_filial": 14,
          "cd_filial__parceiro__nome": null,
          "cd_filial__cep__municipio__uf__nm_abrev": "PR",
          "endereco_entrega__apelido": "Casa",
          "endereco_entrega__endereco": "Rua Padre Dehon",
          "endereco_entrega__cep__endereco_cep": "Padre Dehon",
          "endereco_entrega__numero": "2220",
          "endereco_entrega__bairro": "Boqueirão",
          "endereco_entrega__cep__bairro_cep": null,
          "endereco_entrega__cep__municipio__nome": "Curitiba",
          "endereco_entrega__cep__municipio__uf__nm_abrev": "PR",
          "local_entrega_id__nome": null,
          "local_entrega_id__endereco": null,
          "local_entrega_id__numero": null,
          "local_entrega_id__bairro": null,
          "local_entrega_id__responsavel": null,
          "local_entrega_id__cep_id": null,
          "vlr_cupom": "0.00",
          "cupom__codigo": null,
          "cupom__nome": null,
          "cupom__is_frete_gratis": null,
          "cupom_id": null,
          "nota_valor": null,
          "nota_observacao": null,
          "nota__numero": "0027108",
          "nota__serie": "402",
          "nota__chave": "41240179430682002842554020000271081460432574",
          "nota__arquivo": "",
          "nota__xml": null,
          "cidade_agendamento__nome": null,
          "ultimo_status__ordem": 13,
          "ultimo_status__grupo": "faturamento",
          "pedidoitem__id": "PEDIDO.STATUS.GRUPO",
          "pagamento__codigo_ifood": 4523775,
          "vlr_sem_desconto": null
        },
        {
          "id": 130369101,
          "dat_insercao": "2024-01-30T12:55:08.584Z",
          "vlr_subtotal": "82.85",
          "vlr_entrega": "0.00",
          "vlr_desconto": "0.00",
          "vlr_desconto_pbm": "0.00",
          "vlr_total": "82.85",
          "hash": "b95e2b36-ffc1-4b8f-a4b8-03e6c4f742ac",
          "pagamento_id": 1435383,
          "pagamento__tipo__nm_descritivo": "NisseiPay",
          "pagamento__tipo_id": "cashback",
          "pagamento__url_externa": null,
          "pagamento__codigo_barras": null,
          "pagamento__cartao__bandeira_id": null,
          "pagamento__cartao__bandeira__imagem": null,
          "pagamento__cartao__bandeira__nm_descritivo": null,
          "pagamento__cartao__ultimos_4": null,
          "pagamento__codigo": "130369100",
          "pagamento__qr_code": "",
          "pagamento__informacao": null,
          "pagamento__convenio__nm_descritivo": null,
          "pagamento__redirect": null,
          "qtd_parcelas": 1,
          "vlr_total_parcelado": "82.85",
          "tipo_entrega_id": "retirada",
          "tipo_entrega__tipo_codigo": "retirada",
          "tipo_entrega__imagem": "ecommerce/icones/retirada.png",
          "tipo_entrega__nm_descritivo": "Retirada em Loja",
          "cd_filial__nome": "PORTAO 24HRS",
          "is_retirado_terceiro": false,
          "retirado_terceiro_cpf": null,
          "retirado_terceiro_nome": null,
          "retirado_terceiro_telefone": null,
          "cd_filial__endereco": "REPUBLICA ARGENTINA",
          "cd_filial__cep__endereco_cep": "República Argentina",
          "cliente__nm_primeiro": "Nathanael",
          "cliente__nm_completo": "Nathanael Iung",
          "cd_filial__numero": "2930",
          "cd_filial__bairro": "PORTAO",
          "cd_filial__cep__bairro_cep": null,
          "ultimo_status_id": "pedido_transferencia",
          "ultimo_status__nome": "pedido_transferencia",
          "ultimo_status__nm_descritivo": "Transferencia",
          "ultimo_status__is_valido": true,
          "cd_filial__cep__municipio__nome": "Curitiba",
          "cd_filial__cd_filial": 23,
          "cd_filial__parceiro__nome": null,
          "cd_filial__cep__municipio__uf__nm_abrev": "PR",
          "endereco_entrega__apelido": "Casa",
          "endereco_entrega__endereco": "Rua Padre Dehon",
          "endereco_entrega__cep__endereco_cep": "Padre Dehon",
          "endereco_entrega__numero": "2220",
          "endereco_entrega__bairro": "Boqueirão",
          "endereco_entrega__cep__bairro_cep": null,
          "endereco_entrega__cep__municipio__nome": "Curitiba",
          "endereco_entrega__cep__municipio__uf__nm_abrev": "PR",
          "local_entrega_id__nome": "023 - PORTÃO 24H",
          "local_entrega_id__endereco": "Avenida República Argentina",
          "local_entrega_id__numero": "2930",
          "local_entrega_id__bairro": "Portão",
          "local_entrega_id__responsavel": null,
          "local_entrega_id__cep_id": "80610260",
          "vlr_cupom": "0.00",
          "cupom__codigo": null,
          "cupom__nome": null,
          "cupom__is_frete_gratis": null,
          "cupom_id": null,
          "nota_valor": null,
          "nota_observacao": null,
          "nota__numero": null,
          "nota__serie": null,
          "nota__chave": null,
          "nota__arquivo": null,
          "nota__xml": null,
          "cidade_agendamento__nome": null,
          "ultimo_status__ordem": 11,
          "ultimo_status__grupo": "separacao",
          "pedidoitem__id": "PEDIDO.STATUS.GRUPO",
          "pagamento__codigo_ifood": 4523731,
          "vlr_sem_desconto": null
        }
      ]
    });

    this.data = {
      ...dados,
    };

    return this.http.get<any>(`${this.API_ONLINE}buscar/pedidos`, {
      headers: this.headerService.getHeader(),
      params: this.data,
    });
  }

  buscarEstoqueRedeProduto(dados): Observable<any> {
    return of({
      status: true,
      estoque: 35
    });

    this.data = {
      ...dados,
    };

    return this.http.get<any>(`${this.API_ONLINE}estoque/buscar`);
  }

  buscarValorCaixa(): Observable<any> {
    return of({
      valor_caixa: 276.5,
      limite_sangria: 500,
    });
    return this.http.get<any>(`${this.API_BACK}valor_caixa`);
  }

  buscarMetas(): Observable<any> {
    return of({
      meta_diaria: 5000,
      realizado_diario: 2780,
      meta_mensal: 50000,
      realizado_mensal: 23690.9,
    });
    return this.http.get<any>(`${this.API_BACK}metas`);
  }

  buscarLabel(): Observable<any> {
    return of({
      menu_metas: {
        label: 'Metas (F1)',
        atalho: 'F',
        alt: false,
        ctrl: false,
        shift: false,
      },
      menu_rec_cel: {
        label: 'Rec. Cel. (F2)',
        atalho: 'F2',
        alt: false,
        ctrl: false,
        shift: false,
      },
      menu_caixa: {
        label: 'Caixa (F2)',
        atalho: 'F2',
        alt: false,
        ctrl: false,
        shift: false,
      },
      menu_pre_venda: {
        label: 'Pré-venda (F3)',
        atalho: 'F3',
        alt: false,
        ctrl: false,
        shift: false,
      },
      menu_menu: {
        label: 'Menu (F4)',
        atalho: 'F4',
        alt: false,
        ctrl: false,
        shift: false,
      },
      menu_bloequear: {
        label: 'Menu (F11)',
        atalho: 'F11',
        alt: false,
        ctrl: false,
        shift: false,
      },
      menu_sair: {
        label: 'Sair (F12)',
        atalho: 'F12',
        alt: false,
        ctrl: false,
        shift: false,
      },
    });
    return this.http.get<any>(`${this.API_BACK}labels`);
  }
}
