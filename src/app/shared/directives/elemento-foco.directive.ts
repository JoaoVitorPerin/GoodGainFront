import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appElementoFoco]',
  standalone: true
})
export class ElementoFocoDirective {

  @Input('appElementoFoco') appElementoFoco: string;
  @Input({required: true}) atalho: string;
  @Input() ctrl: boolean;
  @Input() shift: boolean;
  @Input() alt: boolean;
  @Input() tipo: 'input'|'button'

  @Input() _ctrl: boolean;
  @Input() _shift: boolean;
  @Input() _alt: boolean;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  @HostListener('window:keydown', ['$event'])
  handleAtalho(event: KeyboardEvent): void {
    if(this.atalho){

      if (event.key == this.atalho && this.appElementoFoco) {

        let targetElement = null

        if(!this.tipo || this.tipo === 'input')
          targetElement = this.el.nativeElement.ownerDocument.getElementById(this.appElementoFoco)?.querySelector('input');

        if(targetElement){
          if(!this.ctrl && !this.shift && !this.alt && !this._ctrl && !this._shift && !this._alt && !event.ctrlKey && !event.shiftKey && !event.altKey){
            event.preventDefault()
            this.renderer.selectRootElement(targetElement).focus();
          } else {
            if((this.ctrl || this._ctrl) && event.ctrlKey){
              event.preventDefault()
              this.renderer.selectRootElement(targetElement).focus();
            } else if((this.shift || this._shift) && event.shiftKey){
              event.preventDefault()
              this.renderer.selectRootElement(targetElement).focus();
            } else if((this.alt || this._alt) && event.altKey) {
              event.preventDefault()
              this.renderer.selectRootElement(targetElement).focus();
            }
          }
        }
      }
    }
  }

}
