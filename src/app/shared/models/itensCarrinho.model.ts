export interface itensCarrinho {
  produto_id: string;
  ean: string;
  eans: Array<any>;
  quantidade: number;
  quantidade_removida: number;
  nm_produto: string;
  imagem: string;
  descricao: string,
  tipo_produto: null | string;
  nm_marca: string;
  is_pre_venda: boolean;
  preco: any;
  pesquisa?: string;
}
