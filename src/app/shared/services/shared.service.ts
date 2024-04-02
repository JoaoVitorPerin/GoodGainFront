import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedService {

  invokeFunction = new EventEmitter();
  subs: Subscription;

  constructor() {}

  update(){
    this.invokeFunction.emit()
  }

}
