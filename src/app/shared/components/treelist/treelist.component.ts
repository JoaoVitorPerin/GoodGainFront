import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import dayjs from 'dayjs';
import { DxTooltipComponent, DxTreeListComponent } from 'devextreme-angular';
import ArrayStore from 'devextreme/data/array_store';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';

import { toLocaleFixed, validarPermissao } from 'src/app/core/ts/util';
import { LayoutService } from 'src/app/core/layout/app.layout.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-treelist',
  templateUrl: './treelist.component.html',
  styleUrl: './treelist.component.css'
})
export class TreelistComponent implements OnInit{
  @ViewChild(DxTreeListComponent, { static: false }) treeList: DxTreeListComponent;
  @ViewChild(DxTooltipComponent) tooltip: DxTooltipComponent;
  @Input({required: true}) columns: any;
  @Input({required: true}) configuracoes: any;
  @Input() data: any = null;
  @Input() idElemento: any = null;
  @Input() idPai: any = null;
  
  validarPermissao = validarPermissao;
  popupOptions: any = null;
  dataSource: DataSource | CustomStore;
  init = false;
  dataTeste = [];
  colunasEditadas: any;
  dataEditada: any = [];
  isMobile: boolean = false;
  isColumnChooserVisible: boolean = false;
  stringPesquisa: string = '';
  parouDigitar: boolean = false;
  timer: any
  dayjs = dayjs;
  tooltipData: any;
  termoPesquisa: string = '';
  showMaisOpcoes: boolean = false;

  isLoading: boolean = false;

  constructor(private layoutService: LayoutService) {
    this.isMobile = this.layoutService.isMobile();
  }

  ngOnInit(): void {
    if (this.configuracoes.acoes.length) {
      this.adicionarColunasAcoes();
    }
  }

  clickAcoes(config, event){
    if (config.is_excluir) {
      this.deleteRow(event)
      return
    }
    config.click(event.data)
  }

  deleteRow(row: any): void {
    this.isLoading = true
    
    let index = row?.rowIndex

    let novoDataSource = []
    novoDataSource = this?.treeList?.instance?.getDataSource()?.items()
    novoDataSource.splice(index, 1)

    this.dataSource = new DataSource({
      store: new ArrayStore({
        //key: 'id',
        data: novoDataSource,
      }),
    })
  }

  getValueCampoMestreDetalhe(ev: any, row: any){
    let novo_valor

    if(ev?.target?.value)
      novo_valor = ev?.target?.value

    if(ev?.checked === false)
      novo_valor = false

    if(ev?.checked === true)
      novo_valor = true

    if(ev?.value)
      novo_valor = ev?.value

    this.setValueMestreDetalhe(novo_valor, row)

  }

  setValueMestreDetalhe(valor: any, row: any) {

    let index = row?.rowIndex
    let coluna = row?.column?.dataField
    let dados_tabela = this?.treeList?.instance?.getDataSource()?.items()

    dados_tabela[index][coluna] = valor

    this.dataSource = new DataSource({
      store: new ArrayStore({
        //key: 'id',
        data: dados_tabela,
      }),
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.init = false;
    this.dataTeste = changes.data.currentValue;
    
    if (this.columns) {
      this.colunasEditadas = JSON.parse(JSON.stringify(this.columns));
    }
    if (this.data) {
      this.dataEditada = JSON.parse(JSON.stringify(this.data));
    }

    const novaLinha = {};
    if (this.colunasEditadas) {
      // Pega o callback setado nas colunas e concatena com o callback padrão que vai em todas as tabelas, no header e na celula.
      for (let i = 0; i < this.colunasEditadas.length; i++) {
        const coluna = this.colunasEditadas[i];

        // Pega o callback do header que foi setado na coluna e atribui a função de padronização
        const funcHeader = this.columns[i].headerCellTemplate;
        coluna.headerCellTemplate = (c, options) => {
          this.filterRowHeader(c, options, true, this);
          if (funcHeader) {
            funcHeader(c, options);
          }
        };

        // Pega o callback da costumização da celula que foi setado na coluna e atribui a função de padronização
        if (
          ((this.data || !this.data) && typeof coluna.cellTemplate === 'function') ||
          coluna.cellTemplate === undefined
        ) {
          const funcCell = this.columns[i].cellTemplate;
          coluna.cellTemplate = (c, options) => {
            this.replaceCell(c, options, '', '');

            if (funcCell) {
              funcCell(c, options);
            }

            if (options.column.dataType === 'boolean' && (this.data || !this.data)) {
              if (options.data[options.column.dataField] === true) {
                c.innerHTML = `<span class="icon_check02 text-success font-4xl"></span>`;
              } else {
                c.innerHTML = `<span class="icon_close02 text-danger font-4xl"></span>`;
              }
            }

            if (!this.data) {
              c.innerHTML = `<div class="loader"></div>`;
            }
          };
        }

        // Pega o callback do header que foi setado na coluna e atribui a função de padronização
        const funcGroup = this.columns[i].groupCellTemplate;
        if (funcGroup) {
          coluna.groupCellTemplate = (c, options) => {
            if (funcGroup) {
              funcGroup(c, options, this.init);
            }
          };
        }

        // cria template de colunas para criar o loader quando não chegar dados na tabela.
        novaLinha[coluna.dataField] = '';
      }
    }

    // Se não carregou os dados ainda cria com base nas colunas novas linhas vazias.
    if (!this.data) {
      this.dataEditada = [];
      for (let i = 0; i < 10; i++) {
        this.dataEditada.push(novaLinha);
      }
    }

    // Instancia do array que vai na tabela
    this.dataSource = new DataSource({
      store: new ArrayStore({
        //key: 'id',
        data: this.dataEditada,
      }),
    });
  }

  adicionarColunasAcoes() {
    let colunaAcoes = this.columns.find((coluna) => coluna.cellTemplate === 'acoes');
    if (colunaAcoes && Object.keys(colunaAcoes).length) {
      this.columns.splice(this.columns.indexOf(colunaAcoes), 1);
    }
    this.columns.push({
      dataField: 'acoes',
      caption: 'Ações',
      dataType: 'string',
      allowSorting: false,
      allowFiltering: false,
      allowHeaderFiltering: false,
      allowColumnReordering: false,
      allowColumnResizing: false,
      allowGrouping: false,
      width: this.isMobile ? 60 : 220,
      fixed: this.isMobile ? false : true,
      fixedPosition: 'right',
      cellTemplate: 'acoes'
    })

    if ((this.configuracoes.acoes.length > 3 && this.layoutService.isDesktop())) {
      this.configuracoes.maisAcoes = this.configuracoes.acoes.splice(2, this.configuracoes.acoes.length);
    }

    if ((this.layoutService.isMobile())) {
      this.configuracoes.maisAcoes = this.configuracoes.acoes.splice(0, this.configuracoes.acoes.length);
    }
  }

  filterRowHeader(c: any, opcoes: any, headerDefault: any, thisThis: any = true): void {

    if (!headerDefault) {
      headerDefault = true;
    }

    let dataField = opcoes.column.dataField?.toString();
    let dataSource = opcoes.component._options._optionManager._options.dataSource;
    let dataType = opcoes.column.dataType?.toString();
    let title = opcoes.column.caption?.toString();
    let itemExampleValue;

    if (opcoes.component._options._optionManager._options.dataSource?._items?.length > 0) {
      itemExampleValue = opcoes.component._options._optionManager._options.dataSource._items[0][dataField];
    } else {
      itemExampleValue = '0.00';
    }

    const button = $('<span/>').on('click.naoenche', (e: any) => {
      dataField = opcoes.column.dataField.toString();
      dataSource = opcoes.component._options._optionManager._options.dataSource;
      dataType = opcoes.column.dataType.toString();
      title = opcoes.column.caption.toString();
      if (opcoes.component._options._optionManager._options.dataSource?._items?.length > 0) {
        itemExampleValue = opcoes.component._options._optionManager._options.dataSource?._items[0][dataField];
      }
      else {
        itemExampleValue = '0.00';
      }
      e.preventDefault();

      thisThis.popupOptions = this.showInfo(dataField, dataSource, dataType, button, title, itemExampleValue, thisThis);

      e.stopPropagation();
    })

    .html(``).attr('data-toggle', 'tooltip').attr('data-placement', 'top')
    .attr('data-value', '').attr('data-between', '').attr('data-expression', '')
    .attr('data-field', dataField).attr('data-type', dataType).attr('data-item', itemExampleValue)
    .addClass('ml-2 seletorSpanFilter dx-icon-filter-condition mr-3');

    c = $(c);
    c.parent().find('.dx-column-indicators')

    if (headerDefault) {
      const text = $('<div/>')
        .html(opcoes.column.caption);
      c.append(text);
    }
  }

  replaceCell(c: any, options: any, qualFormatoString: any, fontSizeString: any): void {
    options.component._$element.find('.dx-scrollable-wrapper').css('width', '100%');
    // options.component._$element.find('.dx-scrollable-container').css('overflow-x', 'auto');

    c = $(c);

    c.css('text-align', 'center');
    const dataField = options.column.dataField;
    let value = options.data[dataField];
    if (parseFloat(options.data[dataField]).toString() === 'NaN') {
      value = options.data[dataField];
    } else {
      value = this.formatarValor(qualFormatoString, value);
    }
    if (fontSizeString === undefined) {
      fontSizeString = '';
    }
    if (qualFormatoString === '') {
      value = options.data[dataField];
    }
    if (options.data[dataField] === undefined || options.data[dataField] === null ||
      options.data[dataField] === 'null' || options.data[dataField] === '') {
      value = '';
    }
    c.text(`${value}`).find('*').css('fontSize', fontSizeString);
  }

  showInfo(dataField: any, dataSource: any, dataType: any, button: any, title: any, itemExampleValue: any, thisThis: any): any {
    const arrayOutrosFiltros = [];
    const colunas = button.parent().parent().parent().children();
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < colunas.length; i++) {
      if (colunas[i].getElementsByClassName('dx-column-indicators').length > 0) {
        if (colunas[i].getElementsByClassName('dx-column-indicators')[0].getElementsByClassName('seletorSpanFilter').length > 0) {
          // tslint:disable-next-line: max-line-length
          const filtro = colunas[i].getElementsByClassName('dx-column-indicators')[0].getElementsByClassName('seletorSpanFilter')[0];
          const filtroExpression = filtro.getAttribute('data-expression');
          let filtroValue = filtro.getAttribute('data-value');
          let filtroValueBetweeen = filtro.getAttribute('data-between');
          const filtroDataType = filtro.getAttribute('data-type');
          const filtroDataField = filtro.getAttribute('data-field');
          const filtroDataItem = filtro.getAttribute('data-item');

          if (filtroValue !== '' && filtroDataField !== dataField) {
            filtroValue = this.formatarValorFiltro(filtroDataType, filtroValue, filtroDataItem);
            if (filtroExpression === '><') {
              if (filtroValueBetweeen.indexOf(',') !== -1) {
                filtroValueBetweeen = filtroValueBetweeen.replace(/[.]/g, 'x').replace(/[,]/g, '.').replace(/[x]/g, '');
              }
              else {
                filtroValueBetweeen = filtroValueBetweeen.replace(/[.]/g, '');
                filtroValueBetweeen += '.00';
              }
            }

            if (filtroExpression !== '' && filtroExpression !== '><') {
              arrayOutrosFiltros.push([filtroDataField, filtroExpression, filtroValue]);
            }
            else if (filtroExpression === '><') {
              if (filtroValue < filtroValueBetweeen) {
                arrayOutrosFiltros.push([
                  [filtroDataField, '>', filtroValue],
                  [filtroDataField, '<', filtroValueBetweeen]
                ]);
              }
              else {
                arrayOutrosFiltros.push([
                  [filtroDataField, '<', filtroValue],
                  [filtroDataField, '>', filtroValueBetweeen]
                ]);
              }
            }
          }
        }
      }
    }
  }

  formatarValor(qualFormatoString: any, value: any): any {
    let valor: string;
    switch (qualFormatoString) {
      case '%':
        valor = toLocaleFixed(parseFloat(value), 2) + '%';
        break;
      case 'R$':
        valor = 'R$ ' + toLocaleFixed(parseFloat(value), 2);
        break;
    }
    return valor;
  }

  formatarValorFiltro(dataType: any, value: any, itemExampleValue: any): string {
    if (value !== '') {
      if (parseFloat(value).toString() === 'NaN' && dataType === 'string') {
      }
      else {
        if (itemExampleValue) {
          const whatFormat = itemExampleValue.substring(itemExampleValue.length - 3, itemExampleValue.length);
          if (whatFormat.indexOf('.') !== -1) {
            if (value.indexOf(',') !== -1) {
              value = value.replace(/[.]/g, 'x').replace(/[,]/g, '.').replace(/[x]/g, '');
            } else {
              value = value.replace(/[.]/g, '');
              value += '.00';
            }
          }
        }
      }
    }
    return value;
  }

  onDragChangeHandler = (e) => {
    this.onDragChange(e);
  }

  onReorderHandler = (e) => {
    this.onReorder(e);
  }

  onDragChange(e) {
    let visibleRows = e.component.getVisibleRows(),
      sourceNode = e.component.getNodeByKey(e.itemData.id),
      targetNode = visibleRows[e.toIndex].node;

    while(targetNode && targetNode.data) {
        if (targetNode.data.id === sourceNode.data.id) {
            e.cancel = true;
            break;
        }
        targetNode = targetNode.parent;
    }
  }
  
  onReorder(e) {
    let visibleRows = e.component.getVisibleRows(),
      sourceData = e.itemData,
      targetData = visibleRows[e.toIndex].data,
      sourceIndex = this.data.indexOf(sourceData),
      targetIndex = this.data.indexOf(targetData);
  
    if (e.dropInsideItem) {
      sourceData[this.idPai] = targetData[this.idElemento];
    } else {
      if (sourceIndex < targetIndex) {
        this.data.splice(targetIndex + 1, 0, this.data.splice(sourceIndex, 1)[0]);
      } else if (sourceIndex > targetIndex) {
        this.data.splice(targetIndex, 0, this.data.splice(sourceIndex, 1)[0]);
      }
  
      if (sourceData[this.idPai] !== targetData[this.idPai]) {
        sourceData[this.idPai] = targetData[this.idPai];
      }
  
      this.atualizarOrdemItens(e.itemData);
    }
    
    e.component.option('dataSource', [...this.data]);
    e.component.refresh();
  }

  atualizarOrdemItens(itemMovido) {
    if (itemMovido[this.idPai]) {
      let filhos = this.data.filter(item => item[this.idPai] === itemMovido[this.idPai]);
      filhos.forEach((item, index) => {
        let posicaoCorreta = this.data.findIndex(i => i[this.idElemento] === item[this.idElemento]);
        this.data[posicaoCorreta].ordem = index + 1;
      });
    } else {
      let pais = this.data.filter(item => !item[this.idPai]);
      pais.forEach((item, index) => {
        let posicaoCorreta = this.data.findIndex(i => i[this.idElemento] === item[this.idElemento]);
        this.data[posicaoCorreta].ordem = index + 1;
      });
    }

    this.dataSource = new DataSource({
      store: new ArrayStore({
        data: this.data,
      }),
    });
  }
}