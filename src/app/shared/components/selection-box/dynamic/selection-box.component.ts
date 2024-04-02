import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-selection-box',
  templateUrl: './selection-box.component.html',
  styleUrls: ['./selection-box.component.css']
})
export class SelectionBoxComponent {

  private _initialX: number = 0;
  public get initialX() {
    return this._initialX;
  }
  public set initialX(x) {
    this._initialX = x;
    this._x = x;
    this._left = x;
    this._width = 0;
  }

  private _initialY: number = 0;
  public get initialY() {
    return this._initialY;
  }
  public set initialY(y) {
    this._initialY = y;
    this._y = y;
    this._top = y;
    this._height = 0;
  }

  private _x: number = 0;
  public get x() {
    return this._x;
  }
  public set x(x) {
    this._x = x;

    const width = x - this.initialX;
    this._width = Math.abs(width);

    if (width < 0)
      this._left = x;
    else
      this._left = this.initialX;
  }

  private _y: number = 0;
  public get y() {
    return this._y;
  }
  public set y(y) {
    this._y = y;
    
    const height = y - this.initialY;
    this._height = Math.abs(height);

    if (height < 0)
      this._top = y;
    else
      this._top = this.initialY;
  }

  private _left: number = 0;
  public get left() {
    return this._left;
  }

  private _top: number = 0;
  public get top() {
    return this._top;
  }

  private _width: number = 0;
  public get width() {
    return this._width;
  }

  private _height: number = 0;
  public get height() {
    return this._height;
  }

  constructor() { }
}
