import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalConfirmacaoService } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.service';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { items } from 'src/app/shared/models/items.model';
import { Location } from '@angular/common';
import { UsuariosService } from '../../usuarios.service';
@Component({
  selector: 'app-cadastro-perfis',
  templateUrl: './cadastro-perfis.component.html',
  styleUrl: './cadastro-perfis.component.css'
})
export class CadastroPerfisComponent implements OnInit{
  formularioCadastroPerfis: FormGroup;
  itemsPagPerformance: Array<items> = [];
  itemsPagVendaMais: Array<items> = [];
  nomePerfil: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private modalConfirmacaoService: ModalConfirmacaoService,
    private usuariosService: UsuariosService,
    private location: Location
  ) {
  }

  ngOnInit(): void {
    this.formularioCadastroPerfis = this.formBuilder.group({
      nome: [null, Validators.required],
      nm_descritivo: [null, Validators.required],
      paginicio_performance: [null],
      paginicio_vendamais: [null],
      descricao: [null],
      ponto_funcao: [null],
      is_public: [null],
      modulo_id: [null],
    }); 

    this.nomePerfil = this.activatedRoute.snapshot.paramMap.get('id');
    this.formularioCadastroPerfis.patchValue({nome: this.nomePerfil});

    if(this.nomePerfil){
      this.formularioCadastroPerfis.get('nome').disable();
      this.buscarDadosPerfil(this.nomePerfil);
    }else{
      this.formularioCadastroPerfis.get('nome').enable();
      this.usuariosService.getPerfilInfos().subscribe((res) => {
        this.preencherComboBoxes(res);
      });
    }
  }

  onSubmit() {
    if (this.formularioCadastroPerfis?.invalid && this.nomePerfil) {
      this.formularioCadastroPerfis?.markAllAsTouched()
      return;
    }

    this.usuariosService.setPerfil(this.formularioCadastroPerfis.value).subscribe((res) => {
      if(res.status){
        this.toastrService.mostrarToastrSuccess('Perfil cadastrado com sucesso!');
        this.router.navigate(['/usuarios/cadastro/'+ this.nomePerfil]);
      }else{
        this.toastrService.mostrarToastrDanger('Erro ao cadastrar perfil!')
      }
    }, error => {
      this.toastrService.mostrarToastrDanger('Erro ao cadastrar perfil!');
    });
  }

  buscarDadosPerfil(id: string){
    this.usuariosService.getPerfilByName(id).subscribe((res) => {
      if(res.status){
        this.formularioCadastroPerfis.patchValue(res.data);
        this.preencherComboBoxes(res.data);
      }else{
        this.toastrService.mostrarToastrDanger('Erro ao buscar dados do perfil!');
      }
    });
  }

  preencherComboBoxes(dados){
    this.itemsPagPerformance = dados.lista_telas_performance?.map(item => ({
      value: item.id,
      label: item.nome,
    }));

    this.itemsPagVendaMais = dados.lista_telas_vendamais?.map(item => ({
      value: item.id,
      label: item.nome,
    }));
  }
}
