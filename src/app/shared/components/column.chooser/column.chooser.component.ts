import { AfterViewInit, Component, EventEmitter, Input, Output, } from '@angular/core';

const DIGIT_CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function captionize(name) {

  if(!name)
    return

  const captionList = [];
  let i;
  let char;
  let isPrevCharNewWord = false;
  let isNewWord = false;

  for (i = 0; i < name.length; i++) {
    char = name.charAt(i);
    isNewWord =
      (char === char.toUpperCase() &&
        char !== '-' &&
        char !== ')' &&
        char !== '/') ||
      char in DIGIT_CHARS;
    if (char === '_' || char === '.') {
      char = ' ';
      isNewWord = true;
    } else if (i === 0) {
      char = char.toUpperCase();
      isNewWord = true;
    } else if (!isPrevCharNewWord && isNewWord) {
      if (captionList.length > 0) {
        captionList.push(' ');
      }
    }
    captionList.push(char);
    isPrevCharNewWord = isNewWord;
  }
  return captionList.join('');
}

@Component({
  selector: 'app-column-chooser',
  templateUrl: './column.chooser.component.html',
  styleUrls: ['./column.chooser.component.css']
})
export class ColumnChooserComponent implements AfterViewInit {

  @Input() visible: boolean;
  @Input() columns: any[];
  @Input() container: string;
  @Output() visibleChange = new EventEmitter();
  @Output() checkedChange = new EventEmitter();

  listDataSource: any[];

  public selectedItems: any = [];

  constructor() {

  }

  onHidden(e): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  eventoColuna(): void {
    this.checkedChange.emit(this.selectedItems);
    this.listDataSource.forEach((item, index) => {
      
      this.columns[index].visible = this.selectedItems.includes(
        item.dataField
      );
    });
  }

  ngAfterViewInit() {
    if(this.columns?.length){

      let colunas = []
      this.columns?.map(col => {
        if(col?.dataField)
          colunas.push(col)
      })

      this.listDataSource = JSON.parse(JSON.stringify(colunas));
      this.listDataSource.forEach(column => {
        column.caption = column.caption ? column.caption : captionize(column.dataField);
        column.template = null;
        column.visible = column.visible !== false;
        if (column.visible) {
          this.selectedItems.push(column.dataField);
        }
      });
    }
  }
}
