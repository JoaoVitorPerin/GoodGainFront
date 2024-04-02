import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectionBoxService {

  private _selected: Subject<any[]> = new Subject();
  $selected: Observable<any[]> = this._selected.asObservable();

  private _dropped: Subject<any> = new Subject();
  $dropped: Observable<any> = this._dropped.asObservable();
  
  constructor() { }

  selectItems(items: any[]): void {
    this._selected.next(items);
  }

  dropItems(item: any): void {
    this._dropped.next(item);
  }
}
