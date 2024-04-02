import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/core/layout/app.layout.service';
import { ModalConfirmacaoService } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.service';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { items } from 'src/app/shared/models/items.model';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-cadastro-telas',
  templateUrl: './cadastro-telas.component.html',
  styleUrl: './cadastro-telas.component.css'
})
export class CadastroTelasComponent implements OnInit {
  formularioCadastroTelas: FormGroup;
  idTela: string = '';
  itemsVersao: Array<items> = [];
  itemsModulo: Array<items> = [];
  todasTelas: Array<any> = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private modalConfirmacaoService: ModalConfirmacaoService,
    private layoutService: LayoutService,
    private adminService: AdminService
  ) {
  }

  ngOnInit(): void {
    this.formularioCadastroTelas = this.formBuilder.group({
      tela_id: [null],
      nome: [null, Validators.required],
      codigo: [null, Validators.required],
      descricao: [null],
      url: [null, Validators.required],
      ajuda: [null],
      tags: [null],
      ultima_versao_id: [null],
      modulo_id: [null, Validators.required],
      pontofuncao_id: [null],
    })

    this.idTela = this.activatedRoute.snapshot.paramMap.get('id');
    this.formularioCadastroTelas.patchValue({tela_id: this.idTela});

    if (this.idTela) {
      this.adminService.getTelaByID(this.idTela).subscribe((res) => {
        this.setModuloItems(res.lista_modulos)
        this.setVersaoItems(res.lista_versoes)
        this.formularioCadastroTelas.patchValue(res.dict_tela);
      });
    }else{
      this.adminService.getTela().subscribe((res) => {
        this.setModuloItems(res.lista_modulos)
        this.setVersaoItems(res.lista_versoes)
      });
    }
  }

  onSubmit() {
    this.formularioCadastroTelas?.markAllAsTouched()

    if (this.formularioCadastroTelas?.invalid) {
      return;
    }

    this.adminService.setTela(this.formularioCadastroTelas.value).subscribe((res) => {
      if(res.status){
        this.toastrService.mostrarToastrSuccess('Tela cadastrada com sucesso!');
        this.router.navigate(['admin/telas/cadastro/'+res.tela_id]);
      }else{
        this.toastrService.mostrarToastrDanger('Erro ao cadastrar a tela!')
      }
    }, error => {
      this.toastrService.mostrarToastrDanger("Erro ao cadastrar a tela!");
    });
  }

  setVersaoItems(items: Array<any>) {
    if(!items) return;
    this.itemsVersao = items.map(item => ({
      value: item.id,
      label: `${item.versao} - ${item.descricao}`,
    }));
  }

  setModuloItems(items: Array<any>) {
    this.itemsModulo = items.map(item => ({
      value: item.id,
      label: item.nome,
    }));
  }

}
