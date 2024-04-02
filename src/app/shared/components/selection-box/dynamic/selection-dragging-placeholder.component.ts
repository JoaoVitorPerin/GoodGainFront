import { Component } from "@angular/core";

@Component({
    selector: 'app-dragging-placeholder',
    template: `
        <div class="dragging-placeholder" [attr.data-size]="size" [ngStyle]="{ 'left.px': x, 'top.px': y }">
            <img [src]="placeholder" alt="Movendo itens">
        </div>
    `
})
export class SelectionDraggingPlaceholderComponent {

    private _placeholder: string = 'assets/img/selection-box/icon-drag-placeholder.svg';
    public get placeholder() {
      return this._placeholder;
    }
    public set placeholder(p) {
      this._placeholder = p;
    }

    private _size: number = 0;
    public get size() {
      console.log(this._size)
      return this._size;
    }
    public set size(size) {
      console.log(size);
      this._size = size;
    }

    private _x: number = 0;
    public get x() {
      return this._x;
    }
    public set x(x) {
      this._x = x;
    }

    private _y: number = 0;
    public get y() {
      return this._y;
    }
    public set y(y) {
      this._y = y;
    }

    constructor() {}
}
