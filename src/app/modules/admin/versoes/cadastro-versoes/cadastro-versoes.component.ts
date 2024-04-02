import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/core/layout/app.layout.service';
import { ModalConfirmacaoService } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.service';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { items } from 'src/app/shared/models/items.model';
import { AdminService } from '../../admin.service';
import moment from 'moment';

@Component({
  selector: 'app-cadastro-versoes',
  templateUrl: './cadastro-versoes.component.html',
  styleUrl: './cadastro-versoes.component.css'
})
export class CadastroVersoesComponent {
  formularioCadastroVersoes: FormGroup;
  idVersao: string = '';
  itemsTela: Array<items> = [];
  todasVersoes: Array<any> = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private adminService: AdminService
  ) {
  }

  ngOnInit(): void {
    this.formularioCadastroVersoes = this.formBuilder.group({
      versao_id: [null],
      data: [null, Validators.required],
      versao: [null, Validators.required],
      descricao: [null],
      tela_id: [null, Validators.required],
    })

    this.idVersao = this.activatedRoute.snapshot.paramMap.get('id');
    this.formularioCadastroVersoes.patchValue({versao_id: this.idVersao});

    if (this.idVersao) {
      this.adminService.getVersaoByID(this.idVersao).subscribe((res) => {
        if (res.dict_versao) {
          const formattedDate = moment(res.dict_versao.data, 'YYYY-MM-DD').format('DD/MM/YYYY');
          res.dict_versao.data = formattedDate;
        }
        this.setTelaItems(res.lista_telas)
        this.formularioCadastroVersoes.patchValue(res.dict_versao);
      });
    }else{
      this.adminService.getVersao().subscribe((res) => {
        this.setTelaItems(res.lista_telas)
      });
    }
  }

  onSubmit() {
    this.formularioCadastroVersoes?.markAllAsTouched()

    if (this.formularioCadastroVersoes?.invalid) {
      return;
    }

    this.adminService.setVersao(this.formularioCadastroVersoes.value).subscribe((res) => {
      if(res.status){
        this.toastrService.mostrarToastrSuccess('Versão cadastrada com sucesso!');
        this.router.navigate(['admin/versoes/cadastro/'+res.versao_id]);
      }else{
        this.toastrService.mostrarToastrDanger('Erro ao cadastrar a versão!')
      }
    }, error => {
      this.toastrService.mostrarToastrDanger("Erro ao cadastrar a versão!");
    });
  }

  setTelaItems(items: Array<any>) {
    this.itemsTela = items.map(item => ({
      value: item.id,
      label: `${item.id} - ${item.nome}`,
    }));
  }

}
