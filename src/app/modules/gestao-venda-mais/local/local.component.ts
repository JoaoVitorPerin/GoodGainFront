import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-local',
  templateUrl: './local.component.html',
  styleUrl: './local.component.css'
})

export class LocalComponent implements OnInit{

  tipo: string

  constructor(private route: ActivatedRoute,
              private router: Router){}

  ngOnInit(): void {

    this.route.params.subscribe(dados => {
      this.tipo = dados?.tipo
    })

    if(!['caixa', 'pre-venda', 'recarga'].includes(this.tipo)){
      //: TODO: Adicionar redirect para a view inicial do usuário logado
      this.router.navigate(['venda-mais', 'local', 'caixa', 'cliente'])
    }
  }

}
