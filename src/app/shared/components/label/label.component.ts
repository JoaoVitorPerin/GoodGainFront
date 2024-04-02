import { AtalhoEventoDirective } from 'src/app/shared/directives/atalho-evento.directive';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, Input, EventEmitter, Output, ElementRef } from '@angular/core';

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [
    CommonModule,
    AtalhoEventoDirective
  ],
  templateUrl: './label.component.html',
  styleUrl: './label.component.css'
})
export class LabelComponent {

  @Input() name: string
  @Input() label: string
  @Input() grid: string
  @Input() items: Array<any>
  @Input() invalid: boolean
  @Input() desativarAtalhos: boolean
  @Input() iconType: string
  @Input() imgWidth: number
  @Input() imgHeight: number
  @Input() cor: string
  @Input() type: string
  @Input() indexFormulario: number
  @Input() control: FormControl

  @Output() clickHandler = new EventEmitter();

  constructor(private el: ElementRef){}

  onClickHandler(ev, id): void {

    if(this.control)
      this.control.setValue(ev)

    if(!this.type || this.type === 'radio'){
      if(!this.el.nativeElement.ownerDocument.getElementById(id).checked)
        this.el.nativeElement.ownerDocument.getElementById(id).checked = true
    }

    this.clickHandler.emit(ev)
  }

}
