import { Subscription, debounceTime } from 'rxjs';
import { ControlContainer, FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { Component, Input, OnInit, EventEmitter, Output, ViewChild, OnChanges, ViewEncapsulation, OnDestroy } from '@angular/core';
import { items } from "../../models/items.model";
import * as dayjs from "dayjs"
import { OverlayPanel } from "primeng/overlaypanel";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  encapsulation: ViewEncapsulation.None,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})

export class FormComponent implements OnInit, OnChanges, OnDestroy{

  @Input() label: string;
  @Input({required: true, }) type: string;
  @Input() formControlName: string;
  @Input() required: boolean;
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() ajuda: string;
  @Input() customStyle: JSON;
  @Input() erro: string;
  @Input() icon: string;
  @Input() rows: number;
  @Input() min: number;
  @Input() max: number;
  @Input() prefix: string;
  @Input() mask: string;
  @Input() slotChar: string;
  @Input() items: Array<items>;
  @Input() itemsSelecionados: Array<items> = [];
  @Input() opcoesPesquisa: any[];
  @Input() placeholder: string;
  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() maxLength: number;
  @Input() grid: string;
  @Input() iconType: string;
  @Input() width: number|string;
  @Input() value: any;
  @Input() textoAgrupamento: string;
  @Input() autoClear: boolean;
  @Input() loading: boolean

  @Output() click = new EventEmitter();
  @Output() blur = new EventEmitter();
  @Output() keyUp = new EventEmitter();
  @Output() keyDown = new EventEmitter();
  @Output() change = new EventEmitter();
  @Output() pesquisar = new EventEmitter();
  @Output() modelChange = new EventEmitter();

  @ViewChild('rangeData') private rangeData: any;
  @ViewChild('overlayPesquisa') overlayPesquisa: OverlayPanel;
  @ViewChild('inputPesquisa') inputPesquisa: any;

  formGroup: FormGroup
  dayjs = dayjs;
  minDateDefault: Date;
  maxDateDefault: Date;
  subs: Subscription[] = []

  constructor(private parentFormGroup: FormGroupDirective){
    this.minDateDefault = new Date(this.dayjs().subtract(7, 'days').toDate())
    this.maxDateDefault = new Date('2100-12-31')
  }

  ngOnInit(): void {
    if(this.formControlName && this.parentFormGroup.form){
      this.formGroup = this.parentFormGroup.form
      this.formGroup.addControl(this.formControlName, new FormControl(''))
      if(this.required){
        this.formGroup?.get(this.formControlName)?.addValidators(Validators.required)
        this.formGroup?.updateValueAndValidity()
      }
      if(this.value){
        this.formGroup?.get(this.formControlName)?.setValue(this.value)
      }
    }

    this.subs.push(
      this.formGroup?.get(this.formControlName)?.valueChanges.subscribe(dados => {
        this.change.emit(dados)
      })
    )
    if(this.type == `dualist`){
      if(this.formGroup.value[this.formControlName]?.length){
        this.itemsSelecionados = this.formGroup.value[this.formControlName]?.map(selecionado => {
          return this.items?.find(item => item.value == selecionado)
        })

        this.items = this.items.filter(item => {
          return !this.formGroup.value[this.formControlName].find(selecionado => {
            return selecionado == item.value
          })
        })
      }

      this.subs.push(this.formGroup.get(this.formControlName).valueChanges.pipe(debounceTime(100)).subscribe(dados => {
          this.itemsSelecionados = dados?.map(selecionado => {
            return this.items?.find(item => item.value == selecionado)
          })

          this.items = this.items?.filter(item => {
            return !dados.find(selecionado => {
              return selecionado == item.value
            })
          })
      }))
    }
  }

  ngOnChanges(): void {
    if (this.overlayPesquisa) {
      if (this.opcoesPesquisa.length) {
        this.overlayPesquisa.show(null, this.inputPesquisa.nativeElement)
      }else {
        this.overlayPesquisa.hide()
      }
    }
  }

  ngOnDestroy(): void {
    if(this?.subs?.length){
      for(const sub of this.subs){
        sub.unsubscribe()
      }
    }
  }

  onClickHandler(ev): void {
    this.click.emit(ev)
  }

  onBlurHandler(ev): void {
    this.blur.emit(ev)
  }

  onChangeHandler(ev): void {
    this.change.emit(ev)
  }

  onKeyUpHandler(ev): void {
    this.keyUp.emit(ev)
  }

  onKeyDownHandler(ev): void {
    this.keyDown.emit(ev)
  }

  onPesquisaGenerica(ev): void {
    this.pesquisar.emit(ev)
  }

  onSelectDateRange(): void{
    if (this.formGroup?.get(this.formControlName)?.value?.length && this.formGroup?.get(this.formControlName)?.value[1]) {
      this.rangeData.overlayVisible=false;
    }
  }

  selecionarOpcaoPesquisa(opcao) {
    this.formGroup.get(this.formControlName).setValue(opcao);
    if (this.overlayPesquisa) {
      this.overlayPesquisa.hide()
    }
  }

  onDualistChange() {
    this.formGroup.get(this.formControlName).setValue(this.itemsSelecionados.map(item => item?.value),
      {emitEvent: false});
  }
}
