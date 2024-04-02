import { items } from './../../../shared/models/items.model';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs'
import * as $ from 'jquery'
import { DatagridConfig, datagridConfigDefault } from "src/app/core/ts/datagridConfigDefault";
import { ToastrService } from "src/app/shared/components/toastr/toastr.service";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-wiki-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit{

  formularioPadronizacaoCampos: FormGroup;

  data: Array<any> = [];
  columns: Array<any> = [];
  opcoesRadio: Array<items> = [];
  items: Array<items> = [];

  opcoesPesquisa: any[] = []
  timer: any;

  dayjs = dayjs;

  minDate: any;
  maxDate: any;

  colunas: Array<any> = [];

  configuracoes = datagridConfigDefault()

  itemsDualist: any[] = [
    {
      label: 'Item 1',
      value: 1
    },
    {
      label: 'Item 2',
      value: 2
    },
    {
      label: 'Item 3',
      value: 3
    },
  ]
  selecionadosDualist: any[] = [1]

  modeloPlanilha = [
    { "header": "Nome", "key": "nm_descritivo", "width": 20 },
    { "header": "Código Produto", "key": "produto_id", "width": 20 },
  ]

  columnsTreelist = [
    {
      dataField: 'ordem',
      caption: 'Ordem',
      dataType: 'string',
      cellTemplate(c: any, options: any): void {
      }
    },
    {
      dataField: 'nm_descritivo',
      caption: 'Nome funcionário',
      dataType: 'string',
      cellTemplate(c: any, options: any): void {
      }
    },
    {
      dataField: 'cargo',
      caption: 'Cargo',
      dataType: 'string',
      cellTemplate(c: any, options: any): void {
      }
    },
    {
      dataField: 'loja',
      caption: 'Loja',
      dataType: 'string',
      cellTemplate(c: any, options: any): void {
      }
    },
  ];

  dataTreelist = [
    {
      id: 1,
      ordem: 1,
      nm_descritivo: 'João',
      cargo: 'Gerente',
      loja: 'Loja 1',
      id_pai: null
    },
    {
      id: 2,
      ordem: 1,
      nm_descritivo: 'Maria',
      cargo: 'Vendedora',
      loja: 'Loja 2',
      id_pai: 1
    },
    {
      id: 3,
      ordem: 2,
      nm_descritivo: 'José',
      cargo: 'Vendedor',
      loja: 'Loja 1',
      id_pai: 1
    },
    {
      id: 4,
      ordem: 2,
      nm_descritivo: 'Carlos',
      cargo: 'Gerente',
      loja: 'Loja 2',
      id_pai: null
    },
    {
      id: 5,
      ordem: 1,
      nm_descritivo: 'Pedro',
      cargo: 'Vendedor',
      loja: 'Loja 1',
      id_pai: 4
    },
    {
      id: 6,
      ordem: 2,
      nm_descritivo: 'Ana',
      cargo: 'Vendedora',
      loja: 'Loja 2',
      id_pai: 4
    },
  ];

  idElementoTreelist = "id"
  idPaiTreelist = "id_pai";
  confTreelist: DatagridConfig = datagridConfigDefault();

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService){
  }

  ngOnInit(): void {

    this.formularioPadronizacaoCampos = this.formBuilder.group({
      input_icone_esq: [null, Validators.required],
      textarea: [null, Validators.required],
      input_int: [null, Validators.required],
      input_float: [null, Validators.required],
      input_min_max: [null, Validators.required],
      input_float_prefixo: [null, Validators.required],
      input_mascara: [null, Validators.required],
      input_mascara_placeholder: [null, Validators.required],
      input_password: [null, Validators.required],
      input_switch: [null, Validators.required],
      input_checkbox: [null, Validators.required],
      input_radio: [null, Validators.required],
      select: [null, Validators.required],
      select_multiplo: [null, Validators.required],
      data: [null, Validators.required],
      data_range: [null, Validators.required],
      mestre_detalhe: [this.data, Validators.required],
      dualist: [this.selecionadosDualist, Validators.required],
      cadastro_arvore: this.formBuilder.array([]),
      cadastro_planilha: [null],
    })

    for(let i = 0; i <= 5000; i++){
      this.items.push({
        value: i,
        label: 'Item ' + i
      })
    }

    this.opcoesRadio = [
      {
        value: 1,
        label: 'Opção 1'
      },
      {
        value: 2,
        label: 'Opção 2'
      }
    ]


    this.configuracoes.refresh = () => {
      this.toastrService.mostrarToastrSuccess('mensagem', '123')
    }

    this.configuracoes.customButtons = [
      {
        icon: 'pi pi-plus',
        color: 'success',
        tooltip: 'Mensagem tooltip',
        text: 'Adicionar usuário',
        click: () => {
          return
        }
      },
      {
        icon: 'pi pi-trash',
        color: 'danger',
        tooltip: 'Mensagem tooltip',
        text: 'Excluir usuário',
        click: () => {
          return
        }
      }
    ]

    this.columns = [
      {
        dataField: 'id',
        caption: 'ID',
        dataType: 'string',
      },
      {
        dataField: 'nm_entrega',
        caption: 'Nome entrega',
        dataType: 'string',
        cellTemplate: 'texto'
      },
      {
        dataField: 'nm_entrega_descritivo',
        caption: 'Nome entrega descritivo',
        dataType: 'string',
        cellTemplate: 'texto'
      },
    ]

    this.configuracoes.acoes = [
      {
        icon: 'pi pi-pencil',
        color: 'primary',
        tooltip: 'Editar',
        text: '',
        click: (data: any) => {
          this.toastrService.mostrarToastrSuccess('Mensagem', 'Titulo do toastr')
        }
      },
      {
        icon: 'pi pi-trash',
        color: 'danger',
        tooltip: 'Editar',
        text: '',
        is_excluir: true,
        click: (data: any) => {}
      }
    ]

    this.data = [
      {
        id: '1',
        nm_entrega: 'retirada',
        nm_entrega_descritivo: 2.2,
      },
      {
        id: '2',
        nm_entrega: 'express',
        nm_entrega_descritivo: '2.02',
      }
    ]

    this.minDate = new Date();
    this.maxDate = new Date(this.dayjs().add(7, 'days').toDate());

    //this.formularioPadronizacaoCampos.markAllAsTouched()
  }

  onSubmit() {
    this.formularioPadronizacaoCampos?.markAllAsTouched()

    let dualistValue = this.formularioPadronizacaoCampos.get('dualist').value
    dualistValue = dualistValue.map(item => item.value)
    this.formularioPadronizacaoCampos.get('dualist').setValue(dualistValue)
    // facilicar o debug de erros e envio de dados
    if(!environment.PRODUCTION){
      console.log(this.formularioPadronizacaoCampos.value);
    }
  }


  pesquisaGenerica(campo) {
    clearTimeout(this.timer)
    this.opcoesPesquisa = []
    this.timer = setTimeout(() => {
      let valorCampo = this.formularioPadronizacaoCampos.get(campo).value
      if (valorCampo) {
        let aux = []
        for (let i = 0; i < 600; i++) {
          aux.push(i)
        }
        this.opcoesPesquisa = aux
      }
    }, 500)
  }



}
