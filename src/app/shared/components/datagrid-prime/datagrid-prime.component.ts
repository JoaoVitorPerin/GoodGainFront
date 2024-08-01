import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { FormControl } from '@angular/forms';
import { convertePrecoParaPadraoBR, title, toLocaleFixed, parseDecimal } from 'src/app/core/ts/util';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { saveAs } from 'file-saver';
import { Table } from 'primeng/table';
import { LayoutService } from 'src/app/core/layout/app.layout.service';
import * as dayjs from 'dayjs'
import { Router } from "@angular/router";
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { DatagridPrimeService } from './datagrid-prime.service';
import { BehaviorSubject, distinctUntilChanged, interval, Subscription, switchMap } from "rxjs";
dayjs.extend(customParseFormat)

@Component({
  selector: 'app-datagrid-prime',
  templateUrl: './datagrid-prime.component.html',
  styleUrl: './datagrid-prime.component.css'
})
export class DatagridPrimeComponent implements OnChanges, OnInit, OnDestroy {
  /* Exemplo de column:
  * {
  *   dataField: campo do @Input() data, ex: 'matricula',
  *   caption: 'Matrícula',
  *   sorting: boolean,
  *   filter: boolean,
  *   width: px | % | rem,
  *   cellTemplate: template personalizado, @ViewChild,
  * }
  */
  @Input({required: true}) columns: any;
  @Input() control: FormControl

  @Input() titulo: string
  @Input() subTitulo: string
  @Input() stateId: string

  //configuracoes do DatagridPrimeConfig
  @ViewChild('table') table!: Table;
  @Input({required: true}) configuracoes: any;
  @Input() data: any = null;
  @Input() params: any;
  @Input() invalid: boolean

  @Output() changeSelected = new EventEmitter();

  selected: any = [];

  isMobile: boolean = false;

  globalFilterFields: string[] = [];

  isFiltrosSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  isFiltrosSub: Subscription;

  @ViewChild('rangeDataMasterDetail') private rangeDataMasterDetail: any;

  get isFiltros(): boolean {
    return this.isFiltrosSubject?.value
  }

  constructor(
    layoutService: LayoutService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private datagridPrimeService: DatagridPrimeService,
    private toastrService: ToastrService
  ){
    this.isMobile = layoutService.isMobile();
  }

  allChecked = false;

  expandedRows = {};

  advancedFilter = {};

  subs = [];

  dayjs = dayjs

  termo: string

  minDateDefault: Date;
  maxDateDefault: Date;

  ngOnInit() {
    if(this.control)
      this.control?.setValue(this.data)

    this.minDateDefault = new Date(this.dayjs().toDate())
    this.maxDateDefault = new Date('2100-12-31')

    this.isFiltrosSub = interval(1000).pipe(
      switchMap(() => this.verificarIsFiltros()),
      distinctUntilChanged()
    ).subscribe(data => {
      this.isFiltrosSubject.next(data);
    });
  }

  async verificarIsFiltros(): Promise<any> {
    return new Promise((resolve) => {
      if(this.columns?.length)
        resolve(this.columns?.some((col) => col.filter === true))
      resolve(false)
    })
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, this.configuracoes?.name);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
  }

  searchTable($event: any) {
    this.table.filterGlobal($event?.target?.value, 'contains');
  }

  clear() {
    this.table.clear();
    this.termo = ''
  }

  changeSelection(event, type) {
    if (type === 'all') {
      const isChecked = event.checked;
      this.data.forEach(item => (item.checked = isChecked));
      this.emitChangeSelected();
      return;
    }
    this.allChecked = this.data.every(item => item.checked);
    this.emitChangeSelected();
  }

  emitChangeSelected() {
    this.changeSelected.emit(this.data.filter((item) => item.checked));
  }

  getAdvancedFilter() {
    if(!this.columns?.length)
      return
    this.columns.forEach((column: any) => {
      if (column.advancedFilter) {
        this.advancedFilter[column.dataField] = this.data.map((item: any) => ({
          label: item[column.dataField],
          value: item[column.dataField]
        })).filter((item, index, self) =>
          index === self.findIndex((t) => (
            t.label === item.label && t.value === item.value
          ))
        );
      }
    })
  }

  lazyLoadData(event) {
    if (this.configuracoes.urlLazyLoad) {
      this.subs.push(
        this.datagridPrimeService.getLazyLoad({
          event,
          url: this.configuracoes.urlLazyLoad,
          params: this.params
        }).subscribe((data: any) => {
          this.data = data.retorno;
        })
      )
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    try {
      if (changes?.columns?.currentValue && changes?.columns?.currentValue.length > 0) {
        this.globalFilterFields = this.columns.map((column: any) => column.dataField);
      }
      this.getAdvancedFilter();
    } catch (error) {
      //
    }
  }

  setBackgroundColor(rowData: any): string {
    if(this.configuracoes?.backgroundColor){
      const bgRow = this.configuracoes?.backgroundColor(rowData)
      return bgRow
    }
    return ''
  }

  setBackgroundColorCell(col: any, rowData: any): string {
    if(col?.backgroundColor)
      return col?.backgroundColor(rowData)
    return ''
  }

  setColorCell(col: any, rowData: any): string {
    if(col?.color)
      return col?.color(rowData)
    return ''
  }

  onRowClick(rowData: any): void {
    if(this.configuracoes.rowClick)
      this.configuracoes.rowClick(rowData)
  }

  convertePrecoParaPadraoBR(valor: string): string{
    return convertePrecoParaPadraoBR(valor)
  }

  title(texto: string): string {
    return title(texto)
  }

  toggleColumnLock(col, acao, event: Event) {
    event.stopPropagation();
    col.fixed = acao
    this.cdr.detectChanges();
  }

  converterParaDatetime(datetime: string): string {
    return this.dayjs(datetime).format('DD/MM/YYYY HH:mm')
  }

  converterParaDiaMesAno(date: string): string {

    if(!date)
      return ''

    const regexDiaMesAno = /^\d{2}\/\d{2}\/\d{4}$/
    if(regexDiaMesAno.test(date))
      return date

    return this.dayjs(date, 'YYYY-MM-DD').format('DD/MM/YYYY')
  }

  converterParaAnoMesDia(date: string): string {
    if(!date)
      return ''

    const regexAnoMesDia = /^\d{4}-\d{2}-\d{2}$/
    if(regexAnoMesDia.test(date))
      return date

    return this.dayjs(date, 'DD/MM/YYYY').format('YYYY-MM-DD')
  }

  setMasterDetail(campo: string, ev: any, col: string, index: number): void {

    let valor: any = ''

    switch(campo) {
      case 'text':
        valor = ev?.target?.value
        break;
      case 'float':
        valor = !isNaN(+ev?.target?.value?.replace(/\./g, '')?.replace(',', '.')) ? +ev?.target?.value?.replace(/\./g, '')?.replace(',', '.') : null
        break;
      case 'boolean':
        valor = ev?.checked
        break;
      case 'cpf':
        valor = ev?.target?.value?.replace(/[_\.\-]/g, '')
        break;
      case 'select':
      case 'selectMultiplo':
        valor = ev?.value
        break;
      case 'treeSelect':
        valor = [ev?.node]
        break;
      case 'dateManual':
        valor = this.converterParaAnoMesDia(ev?.target?.value)
        break;
      case 'color':
        valor = ev?.value
        break;
      case 'checkbox':
        valor = ev?.checked
        break;
      case 'selectClearEvent':
        valor = null
        break;
      case 'selectMultiploClearEvent':
        valor = []
        break;
    }

    if(this.data?.length && this.data[index] && Object.keys(this.data[index])?.length)
      this.data[index][col] = valor

    if(this.control)
      this.control?.setValue(this.data)

  }

  selectedRows(): Array<any> {
    if(this.data?.length && this.data.some((item) => item.checked))
      return this.data.filter((item) => item.checked)
    return []
  }

  deleteRowsMasterDetail(): void {
    if(this.data?.length)
      this.data = this.data.filter((item) => !item.checked)
    if(this.control)
      this.control?.setValue(this.data)
    if(!this?.data?.length)
      this.allChecked = false
  }

  addRowMasterDetail(): void {
    const objClone = {}
    if(this.columns?.length){
      for(const col of this.columns){
        objClone[col?.dataField] = col?.default ?? null
      }
    }
    if(objClone && Object.keys(objClone)?.length)
      this.data.push(objClone)
    if(this.control)
      this.control?.setValue(this.data)
    //TODO: O filter abaixo foi adicionado para corrigir o seguinte bug: ao adicionar alguma linha em um mestre detalhe com o state de filtros restaurado, as linhas nao eram exibidas em tela. Com a adição do filter sem nenhuma condição, os itens são exibidos. Verificar a causa e uma solução definitiva para isso
    this.data = this.data.filter((f) => f)
  }

  gerarStateKeyLocalStorage(): string {
   try {
    const url = this.router?.url
    let stateKey = ``
    if(url)
      stateKey = url.replace(/[^a-zA-Z0-9]/g, '_')
    if(this.stateId)
      stateKey += this.stateId
    return stateKey
   } catch (error) {
    //
   }
  }

  stateSave(ev?: any): void {
    try {
      if(this.termo){
        const storageJSON = ev ?? JSON.parse(localStorage.getItem(this.gerarStateKeyLocalStorage()))
        if(storageJSON)
          storageJSON['termo'] = this.termo
        localStorage.setItem(this.gerarStateKeyLocalStorage(), JSON.stringify(storageJSON))
      }
    } catch (error) {
     //
    }
  }

  stateRestore(ev): void {
    if(ev?.termo)
      this.termo = ev?.termo
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
