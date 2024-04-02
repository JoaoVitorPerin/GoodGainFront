import { Component, EventEmitter, Input, Output } from '@angular/core';
import { items } from "../../models/items.model";

@Component({
  selector: 'app-no-form',
  templateUrl: './no-form.component.html',
  styleUrls: ['./no-form.component.css']
})
export class NoFormComponent {

  @Input() label: string;
  @Input({required: true}) type: any;
  @Input({required: true}) model: any;
  @Input() items: Array<items>;
  @Input() placeholder: string;

  @Output() modelChange = new EventEmitter();
  @Output() keyUp = new EventEmitter();

  constructor(){}

  modelHandler(ev): void {
    this.model = ev.target.value
    this.modelChange.emit(this.model)
  }

  onChangeModelHandler(ev): void {
    this.model = ev.value
    this.modelChange.emit(this.model)
  }

  onKeyUpHandler(ev): void {
    this.keyUp.emit(ev)
  }

}
