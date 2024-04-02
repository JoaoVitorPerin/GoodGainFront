import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cabecalho-filial',
  templateUrl: './cabecalho-filial.component.html',
  styleUrl: './cabecalho-filial.component.css'
})
export class CabecalhoFilialComponent {
  @Input() infosFilial: any = {};

  constructor(private router: Router) { }
  
  navigateChecklist(){
    this.router.navigate(['/dashboard/checklist']);
  }
}
