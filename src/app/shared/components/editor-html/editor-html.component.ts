import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { DxCheckBoxModule, DxHtmlEditorModule, DxSelectBoxModule } from 'devextreme-angular';

@Component({
  selector: 'app-editor-html',
  templateUrl: './editor-html.component.html',
  styleUrls: ['./editor-html.component.css'],
  imports: [DxHtmlEditorModule, DxCheckBoxModule, DxSelectBoxModule],
  standalone: true,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class EditorHtmlComponent implements OnInit {

  @Input('controlName') formControlName: string;
  @Input() required: boolean;
  @Input() value: any;

  formGroup: FormGroup;

  isMultiline = true;

  valueContent: string;

  constructor(private parentFormGroup: FormGroupDirective) {
    this.formGroup = this.parentFormGroup.form
  }

  ngOnInit(): void {
    if(this.formControlName){
      if(this.value){
        this.valueContent = this.value
        this.formGroup?.get(this.formControlName)?.setValue(this.value)
      }
    }
  }

  onValueChanged(e){
    this.formGroup?.get(this.formControlName)?.setValue(e.value)
  }

}
