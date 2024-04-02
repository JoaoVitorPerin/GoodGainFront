import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";

@Component({
  selector: 'app-label-button',
  standalone: true,
  imports: [
    InputGroupModule,
    InputGroupAddonModule,
    CommonModule,
    ButtonModule,
    FormsModule
  ],
  templateUrl: './label-button.component.html',
  styleUrl: './label-button.component.css'
})
export class LabelButtonComponent {

  @Input() textoBotao: string
  @Input() placeholder: string
  @Input() readonly: boolean
  @Input() invalid: boolean
  @Input() cor: string

  conteudoInput: string

  @Output() clicked = new EventEmitter()

  onClick(ev: Event): void {
    const data = {
      ...ev,
      value: this.conteudoInput
    }
    this.clicked.emit(data)
  }

}
