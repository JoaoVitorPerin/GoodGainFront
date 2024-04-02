import { Subscription } from 'rxjs';
import { LocalService } from './../../../local.service';
import { itensCarrinho } from 'src/app/shared/models/itensCarrinho.model';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-cesta-header',
  standalone: true,
  imports: [],
  templateUrl: './cesta-header.component.html',
  styleUrl: './cesta-header.component.css'
})
export class CestaHeaderComponent implements OnInit, OnDestroy {

  @Input() produtos: Array<itensCarrinho>

  exclusao: boolean = false;

  subs: Subscription[] = []

  constructor(private localService: LocalService){}

  ngOnInit(): void {
    this.subs.push(this.localService.toggleModoExclusao$.subscribe(decisao => {
      this.exclusao = decisao
    }))

    this.subs.push(this.localService.decisaoModoExclusao$.subscribe(() => {
      this.exclusao = false
    }))
  }

  ngOnDestroy(): void {
    if(this.subs?.length){
      for(const subs of this.subs){
        subs.unsubscribe()
      }
    }
  }

}
