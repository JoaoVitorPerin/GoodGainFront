import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-preco',
  standalone: true,
  imports: [],
  templateUrl: './preco.component.html',
  styleUrl: './preco.component.css'
})
export class PrecoComponent {

  @Input({required: true}) preco: any;
  @Input({required: true}) orientacao: string;
  @Input({required: true}) tamanho: string;
  @Input() quantidade: number;
  @Input() removerVlrIni: boolean;
  @Input() precoAltura: number;

  isMobile: boolean = false

  constructor(){
    this.setIsMobile()
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.setIsMobile()
  }

  setIsMobile(): void {
    if(window.innerWidth < 992){
      this.isMobile = true
    } else {
      this.isMobile = false
    }
  }

  toLocaleFixed(n: any, numero?: number): any {
    if (typeof parseFloat(n) === 'number') {
      return (
        parseFloat(n).toLocaleString('pt-BR', {
          minimumFractionDigits: numero ?? 2,
          maximumFractionDigits: numero ?? 2,
        })
      );
    } else {
      return n;
    }
  }

  parseDecimal(value: string | number): number {
    return parseFloat(value.toString());
  }

  convertePrecoParaPadraoBR(preco: string | number): string {
    return preco !== null ? this.toLocaleFixed(this.parseDecimal(preco), 2) : '0,00';
  }

}
