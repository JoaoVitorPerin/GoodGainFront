import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { DatagridService } from './datagrid.service';
import { environment } from '../../../../environments/environment';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy, AfterViewInit, forwardRef, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { lastValueFrom } from 'rxjs';
import { Workbook } from 'exceljs';
import { exportDataGrid } from "devextreme/excel_exporter";
import * as saveAs from "file-saver";
import * as $ from "jquery"
import * as dayjs from 'dayjs'
import { toLocaleFixed, validarPermissao } from "../../../core/ts/util";
import { DxDataGridComponent } from "devextreme-angular/ui/data-grid";
import { DxTooltipComponent } from "devextreme-angular/ui/tooltip";
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/core/layout/app.layout.service';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatagridComponent),
  multi: true,
};

@Component({
  selector: 'datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.css'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class DatagridComponent
  implements ControlValueAccessor, OnInit, OnChanges, OnDestroy, AfterViewInit
{

  readonly API: string = environment.API_BACK;
  readonly TEMPO_ARMAZENAMENTO_SESSAO = environment.TEMPO_ARMAZENAMENTO_SESSAO;

  @Input({required: true}) columns: any;
  @Input({required: true}) configuracoes: any;
  @Input() parametros: any;
  @Input() urlPaginacao: string;
  @Input() urlRelatorio: string;
  @Input() data: any = null;
  @Input() control: any;
  @Input() controlSearch: any;
  @Output() callbackEmitter = new EventEmitter();

  @Output() event = new EventEmitter();

  @ViewChild('inputEan', {read: ElementRef}) inputEan: ElementRef<HTMLInputElement>;
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  @ViewChild(DxTooltipComponent) tooltip: DxTooltipComponent;

  validarPermissao = validarPermissao;
  popupOptions: any = null;
  dataSource: DataSource | CustomStore;
  init = false;
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

  get value(): any {
    return this.dataEditada;
  }

  set value(v: any) {
    if (v !== this.data || v !== this.dataEditada) {
      this.writeValue(v);
    }
  }

  constructor(
    private datagridService: DatagridService,
    private toastrService: ToastrService,
    private router: Router,
    private layoutService: LayoutService
  ) {
    this.init = false;
    this.isMobile = this.layoutService.isMobile();
    
  }

  ngOnInit(): void {
    this.init = false;
    
    if (this.configuracoes.acoes.length) {
      this.adicionarColunasAcoes();
    }

    if (this.urlPaginacao) {

      function isNotEmpty(value: any): boolean {
        return value !== undefined && value !== null && value !== '';
      }

      this.dataSource = new CustomStore({
        // key: 'id',
        load:(loadOptions: any) => {
          let params: any = {};
          [
            'skip',
            'take',
            'requireTotalCount',
            'requireGroupCount',
            'sort',
            'totalSummary',
            'group',
            'groupSummary',
          ].forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
              params[i] = JSON.stringify(loadOptions[i]);
            }
          });

          let filtrosPesquisa = this.getFiltrosPaginado()

          params['termo'] = filtrosPesquisa.termo;
          params['filtro_colunas'] = filtrosPesquisa.filtro_colunas;

          for (const key in this.parametros) {
            let valor = this.parametros[key]
            if (this.parametros.hasOwnProperty(key) && valor) {
              params[key] = valor
            }
          }

          this.salvarFiltrosStorage()

          if (params.group) {
            return this.buscarDadosColunaPaginado(params);
          }

          return this.buscarDadosTabelaPaginado(params);
        },
        remove(key) {
          return new Promise((resolve, reject) => {
            resolve();
          });
        },
      });

    }

    if(!this.data && this.control?.value && !this.urlPaginacao){
      this.dataSource = new DataSource({
        store: new ArrayStore({
          //key: 'id',
          data: JSON.parse(JSON.stringify(this.control?.value)),
        }),
      });
    }

  }

  buscarDadosTabelaPaginado(params){
    return lastValueFrom(this.datagridService.buscarDadosTabelaPaginado(params, this.urlPaginacao)).then((dados: any) => {
      if(dados.status){
        if(dados.lista_dados?.length){
          return {
            data: dados.lista_dados,
            totalCount: dados.total_count,  
          };
        }
        this.callbackEmitter.emit(dados)
      } else {
        return {
          data: [
            {
              "id": 1,
              "nome": "Teste",
              "descricao": "Teste"
            }
          ],
          totalCount: 10
        }
        this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Não foi possível buscar os dados da página. Data Error')
      }
      return {
        data: [],
        totalCount: 0
      }
    })
    .catch((error) => {
      throw 'Erro ao carregar dados da tabela';
    });
  }

  buscarDadosColunaPaginado(params){
    let agrupamento = JSON.parse(params.group).find((group) => group.hasOwnProperty('desc'))?.selector;
    if (agrupamento) {
      agrupamento = this.columns.find(coluna => coluna.groupIndex).dataField
      params.agrupamento = agrupamento;
    }

    let coluna = JSON.parse(params.group).find((group) => !group.hasOwnProperty('desc'))?.selector;
    if (coluna) {
      params.coluna = coluna;
    }
    
    return lastValueFrom(this.datagridService.buscarDadosColunaPaginado(params, this.urlPaginacao)).then((dados: any) => {
      if(dados.status){
        return {
          data: dados.lista_opcoes,
        };
      } 
      return {
        data: [],
      };
      this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Não foi possível buscar os dados da coluna. Data Error')
      return {
        data: [],
      }
    })
    .catch((error) => {
      throw 'Erro ao carregar dados da tabela';
    });
  }

  blurEmitter(ev: any): void {
    this.event.emit(ev)
  }

 

  ngAfterViewInit() {
    // RESET the custom input form control UI when the form control is RESET
    this.aplicarFiltrosStorage();
    this.control?.valueChanges.subscribe(() => {});
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.init = false;
    
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
          ((this.data || !this.data && this.urlPaginacao) && typeof coluna.cellTemplate === 'function') ||
          coluna.cellTemplate === undefined
        ) {
          const funcCell = this.columns[i].cellTemplate;
          coluna.cellTemplate = (c, options) => {
            this.replaceCell(c, options, '', '');

            if (funcCell) {
              funcCell(c, options);
            }

            if (options.column.dataType === 'boolean' && (this.data || !this.data && this.urlPaginacao)) {
              if (options.data[options.column.dataField] === true) {
                c.innerHTML = `<span class="icon_check02 text-success font-4xl"></span>`;
              } else {
                c.innerHTML = `<span class="icon_close02 text-danger font-4xl"></span>`;
              }
            }

            if (!this.data && !this.urlPaginacao) {
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
    if (!this.data && !this.urlPaginacao && !this.control) {
      this.dataEditada = [];
      for (let i = 0; i < 10; i++) {
        this.dataEditada.push(novaLinha);
      }
    }

    // Instancia do array que vai na tabela
    if (!this.urlPaginacao) {
      this.dataSource = new DataSource({
        store: new ArrayStore({
          //key: 'id',
          data: this.dataEditada,
        }),
      });
    }
  }

  ngOnDestroy(): void {}

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
      width: this.isMobile ? 60 : 250,
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

  mascaraDeFormatacao3Digitos(valor: any, dataType): any {
    if (dataType !== 'string') {
      let isNegativo = '';
      if (valor.substring(0, 1) === '-') {
        isNegativo = '-';
      }
      const value = valor.replace(/[^\d,]/g, '');
      const matches = /^(?:(?:(\d{1,3})?((?:\d{3})*)))((?:,\d*)?)$/.exec(value);
      if (!matches) {
        return;
      }
      const spaceified = matches[2].replace(/(\d{3})/g, '.$1');
      valor = [matches[1], spaceified, matches[3]].join('');
      return isNegativo + valor;
    } else {
      return valor;
    }
  }

  // propagate changes into the custom form control
  propagateChange = (_: any): void => {};

  // From ControlValueAccessor interface
  writeValue(value: any): void {
    if (this.configuracoes?.selection?.mode !== 'multiple') {
      this.dataEditada = JSON.parse(JSON.stringify(value));
      this.data = JSON.parse(JSON.stringify(value));

      // Instancia do array que vai na tabela
      this.dataSource = new DataSource({
        store: new ArrayStore({
          //key: 'id',
          data: this.dataEditada,
        }),
      });
    }
  }

  seletorColunas(e): void {
    this.isColumnChooserVisible = true;
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any): void {}

  isString(val): boolean {
    return typeof val === 'string';
  }

  setMaxHeight(event, maxHeightDesktop: number, maxHeightMobile: number): void {
    this.init = event.component._initialized;
    if (this.init) {
     const container = event.element.getElementsByClassName("dx-datagrid-rowsview")[0];
     if(container){
       let maxHeight: number;
       if(this.isMobile){
         maxHeight = maxHeightMobile ?? 12.5
       } else {
         maxHeight = maxHeightDesktop ?? 27.5
       }
       container.style.maxHeight = maxHeight + 'rem';
       container.style.overflowY = 'hidden';
       container.style.width = '';
     }
    }
  }

  onExporting(e: any, callback): void {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');
    exportDataGrid({
      component: this.dataGrid.instance,
      worksheet,
      customizeCell: (options) => {
        //options.gridCell.column.dataField
        //options.excelCell._value.model.value
      }
    }).then(() => {
      workbook.xlsx.writeBuffer()
        .then((buffer: BlobPart) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'relatorio.xlsx');
        });
    });
    e.cancel = true;
  }

  gerarRelatorio(): void {
    this.datagridService.gerarRelatorio(this.urlRelatorio, this.parametros).subscribe({
      next: (dados) => {
        if(dados.status){
          if(dados.path){
            let pathRelatorio = '/' + dados?.path_intermediaria
            let link = document.createElement("a");
            link.download = `relatorio_${this.dayjs().format('DDMMYYYY')}.xlsx`;
            link.target = '_blank'
            link.href = this.API + pathRelatorio;
            link.click();
          }
        } else {
          this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Não foi possível gerar o relatório')
        }
      }, 
      error: (_err) => {
        this.toastrService.mostrarToastrDanger('Não foi possível gerar o relatório')
      }
    })
  }

  onFileSaving(e: any): void {
    e.fileName = 'relatorio';
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

  bloqueioEnter(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
    }
  }

  clearFilter(): void {
    this.dataGrid.instance.clearFilter('row');
    this.dataGrid.instance.clearFilter('header');
    this.dataGrid.instance.clearFilter('filterValue');
    this.dataGrid.instance.clearFilter('search');
    this.dataGrid.instance.clearFilter('dataSource');
    this.dataGrid.instance.clearFilter('filterValues');
    this.stringPesquisa = '';
    this.dataGrid.instance.state(null)
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
    let dados_tabela = this?.dataGrid?.instance?.getDataSource()?.items()

    dados_tabela[index][coluna] = valor

    this.dataSource = new DataSource({
      store: new ArrayStore({
        //key: 'id',
        data: dados_tabela,
      }),
    });

    if(this.control)
      this.control.setValue(dados_tabela)

  }

  onCellPrepared(ev: any): void {
    // on(ev.cellElement, "mouseover", arg => {
    //   if(ev?.rowType === 'header' && ev?.column?.caption){
    //     this.tooltipData = ev?.column?.caption;
    //     this.tooltip?.instance?.show(arg.target);
    //   } else if(ev?.rowType === 'data' && ev?.column?.dataField && ev.data[ev?.column?.dataField]){
    //     this.tooltipData = ev.data[ev?.column?.dataField];
    //     this.tooltip?.instance?.show(arg.target);
    //   }
    // });
    // on(ev.cellElement, "mouseout", arg => {
    //   this.tooltip?.instance?.hide();
    // });
  }

  onRowPrepared(ev: any): void {}

  refreshAction(callback: Function): void {
    callback();
  }

  clickAcoes(config, event){
    if (config.is_excluir) {
      this.deleteRow(event)
      return
    }
    config.click(event.data)
  }

  addRow(): void {
    this.isLoading = true
    
    let novoDataSource = []
    let objetoEspelho = {}

    if(this.columns?.length){
      this.columns?.map(col =>{
        objetoEspelho[col?.dataField] = ''
      })
    }

    novoDataSource = this?.dataGrid?.instance?.getDataSource()?.items()
    novoDataSource.push(objetoEspelho)

      this.dataSource = new DataSource({
        store: new ArrayStore({
          //key: 'id',
          data: novoDataSource,
        }),
      });

      if(this.control)
        this.control.setValue(novoDataSource)

    setTimeout(() => {
      this.isLoading = false
    }, 300);
  }

  deleteRow(row: any): void {
    this.isLoading = true
    
    let index = row?.rowIndex

    let novoDataSource = []
    novoDataSource = this?.dataGrid?.instance?.getDataSource()?.items()
    novoDataSource.splice(index, 1)

    this.dataSource = new DataSource({
      store: new ArrayStore({
        //key: 'id',
        data: novoDataSource,
      }),
    })

    if(this.control)
      this.control.setValue(novoDataSource)

    setTimeout(() => {
      this.isLoading = false
    }, 500);
  }

  deleteSelectedrows(): void {

  }

  clearTimeout(timer) {
    return clearTimeout(timer);
  }

  opcoesSelect(e): void {
    let dataField = e.column.dataField;
    let opcoes = this.configuracoes?.opcoes?.find(opcao => opcao.dataField === dataField)
    return opcoes?.opcoes
  }

  getFiltrosPaginado() {
    let termo: any;
    let filtro_colunas: any[] = [];
    let filtro_dados_colunas = [];
    termo = this.stringPesquisa ? `%${this.stringPesquisa}%` : null;
    this.columns.forEach((coluna, index) => {
      let filtro = this.dataGrid.instance.columnOption(index)
      
      if (filtro.filterValue || filtro.filterValues) {
        filtro_colunas.push({
          coluna: coluna.dataField,
          termo: filtro.filterValue ? `%${filtro.filterValue}%` : filtro.filterValues.length ? filtro.filterValues : null,
        });
      }

    })
    return {
      termo,
      filtro_colunas: filtro_colunas.length ? JSON.stringify(filtro_colunas) : null,
      filtro_dados_colunas: filtro_dados_colunas.length ? JSON.stringify(filtro_dados_colunas) : null
    }
  }

  salvarFiltrosStorage(): void {
    let filtrosStorage = JSON.parse(localStorage.getItem('filtros-tabela')) ?? [];
    let url = this.router.url
    let filtros = this.dataGrid.instance.state()
    filtros.searchText = this.stringPesquisa;

    if (Object.keys(filtros).length != 0) {
      let objState = {
        state: filtros,
        url: url,
        start: this.dayjs().format('YYYY-MM-DD HH:mm'),
        expire: this.dayjs().add(this.TEMPO_ARMAZENAMENTO_SESSAO, 'm').format('YYYY-MM-DD HH:mm')
      }
      let index = filtrosStorage.findIndex(filtro => filtro.url === url)

      if (index === -1) {
        filtrosStorage.push(objState)
      } else {
        filtrosStorage[index] = objState
      }
      localStorage.setItem('filtros-tabela', JSON.stringify(filtrosStorage))
    }
    
  }

  // Aplica os filtros salvos no storage, com tempo de expiracao de 30min
  aplicarFiltrosStorage(): void {
    let filtrosStorage = JSON.parse(localStorage.getItem('filtros-tabela')) ?? [];
    let filtroTabela = filtrosStorage.find(filtro => filtro.url === this.router.url) ?? {}
    
    if (filtroTabela) {
      if (this.dayjs().isAfter(this.dayjs(filtroTabela?.expire))) {
        filtrosStorage = filtrosStorage.filter(filtro => filtro.url !== this.router.url)
        localStorage.setItem('filtros-tabela', JSON.stringify(filtrosStorage))
        this.dataGrid.instance.state(null)
      }else {
        this.dataGrid.instance.state(filtroTabela.state);
        this.stringPesquisa = filtroTabela?.state?.searchText ?? '';
      }
    }
  }

  changeSeletorColunas(e): void {
    this.salvarFiltrosStorage();
  }

  pesquisarTabela(stringPesquisa): void {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.dataGrid.instance.searchByText(stringPesquisa || '')
    }, 500);
  }

  toogleMaisOpcoes(log){
    this.showMaisOpcoes = !this.showMaisOpcoes
  }

  log(a){
    console.log(a);
  }

}
