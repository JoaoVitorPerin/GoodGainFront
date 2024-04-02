import { AfterContentInit, ComponentFactory, ComponentFactoryResolver, ComponentRef, ContentChildren, Directive, ElementRef, HostListener, Inject, Input, QueryList, ViewContainerRef } from '@angular/core';
import { SelectionBoxComponent } from './dynamic/selection-box.component';
import { SelectionBoxService } from './selection-box.service';
import { SelectionDraggingPlaceholderComponent } from './dynamic/selection-dragging-placeholder.component';

/**
 * Diretiva para transformar um elemento qualquer em um container com itens selecionáveis.
 *
 *
 * Para marcar os itens (html) como selecionáveis, eles devem estar apenas um nível abaixo da hierarquia
 * do container que contém a diretiva. Além disso, cada um deles deve conter a variável de template
 * #selectable como marcador.
 *
 *
 * Para utilizar os itens selecionados, utilize a API do service da selection-box, fazendo subscribe
 * nos eventos de $selected e $dropped.
 */
@Directive({ selector: '[selectionBox]' })
export class SelectionBoxDirective implements AfterContentInit {
    @ContentChildren('selectable') queryItems: QueryList<ElementRef>;

    /**
     * Margem horizontal para criação da selection-box quando os itens estão muito próximos.
     *
     * Medida: px.
     */
    @Input() xMargin: number = 10;
    /**
     * Margem vertical para criação da selection-box quando os itens estão muito próximos.
     *
     * Medida: px.
     */
    @Input() yMargin: number = 0;

    private _selected: Set<HTMLElement> = new Set();

    private _boxFactory: ComponentFactory<SelectionBoxComponent>;
    private _draggingPlaceholderFactory: ComponentFactory<SelectionDraggingPlaceholderComponent>;
    private _draggingPlaceholder: ComponentRef<SelectionDraggingPlaceholderComponent>;
    private _selectionBox: ComponentRef<SelectionBoxComponent>;

    private _drawingBox: boolean = false;
    private _draggingItem: boolean = false;

    private _ctrlPressed: boolean = false;
    private _shiftPressed: boolean = false;

    private _firstSelectedIndex: number = -1;

    private _dragTimeout: NodeJS.Timeout;

    @HostListener('mousedown', ['$event'])
    mouseDown(event: MouseEvent) {
        event.preventDefault();

        const overItem = this.checkItemClick(event);
        this._ctrlPressed = event.ctrlKey;
        this._shiftPressed = event.shiftKey;

        this._drawingBox = false;

        if (overItem) {
            if (event.shiftKey && this._selected.size) {
                this.shiftSelect(event);
                return;
            }

            if (event.ctrlKey) {
                if (!this._selected.size)
                    this.getFirstIndex(overItem);

                this.toggleItem(overItem);
                return;
            }

            if (!this._selected.has(overItem.nativeElement))
                this.clearSelected();

            this.selectItem(overItem);
            this.getFirstIndex(overItem);

            if (event.button === 2)
                return;

            if (this._selected.has(overItem.nativeElement) && event.detail === 1) {
                this._dragTimeout = setTimeout(() => {
                    this.dragItems(event);
                }, 100);

                return;
            }
        }

        this.setBox(event);
    }

    @HostListener('window:mousemove', ['$event'])
    mouseMove(event: MouseEvent) {
        event.preventDefault();

        if (this._draggingItem) {
            this.moveDraggingPlaceholder(event);
            return;
        }

        if (this._drawingBox)
            this.redrawBox(event);
    }

    @HostListener('window:mouseup', ['$event'])
    mouseUp(event: MouseEvent) {
        event.preventDefault();

        this.selectItems();
        clearTimeout(this._dragTimeout);

        if (this._draggingItem) {
            this.dropItems(event);
            this.stopDragging();
            return;
        }

        if (this._drawingBox) {
            this._drawingBox = false;
            this.destroyBox();
        }
    }

    constructor(
        @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
        public viewContainer: ViewContainerRef,
        private ref: ElementRef,
        private selectionBoxService: SelectionBoxService,
    ) {
        this._boxFactory = factoryResolver.resolveComponentFactory(SelectionBoxComponent);
        this._draggingPlaceholderFactory = factoryResolver.resolveComponentFactory(SelectionDraggingPlaceholderComponent);
    }

    ngAfterContentInit(): void {
        this.ref.nativeElement?.classList.add('selection-container');
        this.queryItems.forEach(item => {
            item.nativeElement?.classList.add('selection-item');
        });
    }

    checkItemsHover(): void {
        const box = this._selectionBox.instance;
        const container: HTMLElement = this.ref.nativeElement;
        const containerBox: DOMRect = container.getBoundingClientRect();

        const containerLeft = container.offsetLeft - containerBox.left;
        const containerTop = container.offsetTop - containerBox.top;

        if (!this._ctrlPressed)
            this._selected.clear();

        let firstIndex: number = Infinity;
        this.queryItems.forEach((item, index) => {
            const el: HTMLElement = item.nativeElement;

            if (!this._ctrlPressed && !this._shiftPressed)
                el.classList.remove('selected');

            if (this.checkBoundary(box, el, containerLeft, containerTop)) {
                this.selectItem(item);

                if (index < firstIndex)
                    firstIndex = index;
            }
        });

        if (firstIndex !== Infinity)
            this._firstSelectedIndex = firstIndex;
    }

    checkBoundary(box: SelectionBoxComponent, item: HTMLElement, containerLeft: number, containerTop: number): boolean {
        const itemBox = item.getBoundingClientRect();

        return !(
            itemBox.right < box.left - containerLeft + this.xMargin || itemBox.left > box.left + box.width - containerLeft - this.xMargin ||
            itemBox.bottom < box.top - containerTop + this.yMargin || itemBox.top > box.top - containerTop + box.height - this.yMargin
        );
    }

    selectItems(): void {
        const sel: any[] = [];

        this.queryItems.forEach(item => {
            if (this._selected.has(item.nativeElement))
                sel.push((item.nativeElement as HTMLElement).getAttribute('data-id'));
        });

        this.selectionBoxService.selectItems(sel);
    }

    setBox(event: MouseEvent): void {
        this._drawingBox = true;
        this._draggingItem = false;

        const el: HTMLElement = this.ref.nativeElement;
        const rect: DOMRect = el.getBoundingClientRect();

        this.createBox(event.x - rect.left + el.offsetLeft, event.y - rect.top + el.offsetTop);
        this.checkItemsHover();
    }

    createBox(x: number, y: number): SelectionBoxComponent {
        if (this._selectionBox)
            this.destroyBox();

        this._selectionBox = this.viewContainer.createComponent(this._boxFactory);

        this._selectionBox.instance.initialX = x;
        this._selectionBox.instance.initialY = y;

        return this._selectionBox.instance;
    }

    redrawBox(event: MouseEvent): void {
        const el: HTMLElement = this.ref.nativeElement;
        const rect: DOMRect = this.ref.nativeElement.getBoundingClientRect();

        this._selectionBox.instance.x = event.x - rect.left + el.offsetLeft;
        this._selectionBox.instance.y = event.y - rect.top + el.offsetTop;

        this.checkItemsHover();
    }

    destroyBox(): void {
        if (this._selectionBox)
            this._selectionBox.destroy();
    }

    checkItemClick(event: MouseEvent): ElementRef<any> {
        return this.queryItems.find(item => {
            const el = item.nativeElement;
            return this.checkMouseOver(event, el);
        });
    }

    checkItemDrop(event: MouseEvent): any {
        let id: any;

        this.queryItems.some(item => {
            const el: HTMLElement = item.nativeElement;

            if (this._selected.has(el))
                return false;

            const mouseOver = this.checkMouseOver(event, el);
            if (mouseOver)
                id = el.getAttribute('data-id');

            return mouseOver;
        });

        return id;
    }

    checkMouseOver(event: MouseEvent, item: HTMLElement): boolean {
        const itemBox = item.getBoundingClientRect();
        return (
            (itemBox.left + this.xMargin < event.x && event.x < itemBox.right - this.xMargin) &&
            (itemBox.top + this.yMargin < event.y && event.y < itemBox.bottom - this.yMargin)
        );
    }

    dragItems(event: MouseEvent): void {
        this._draggingItem = true;
        this.ref.nativeElement?.classList.add('dragging-item');

        this._selected.forEach(item => {
            item.classList.add('selection-placeholder');
        });

        this._draggingPlaceholder = this.viewContainer.createComponent(this._draggingPlaceholderFactory);
        this._draggingPlaceholder.instance.size = this._selected.size;

        this.moveDraggingPlaceholder(event);
    }

    moveDraggingPlaceholder(event: MouseEvent): void {
        this._draggingPlaceholder.instance.x = event.x;
        this._draggingPlaceholder.instance.y = event.y;
    }

    dropItems(event: MouseEvent): void {
        const id = this.checkItemDrop(event);

        if (id !== undefined && id !== null)
            this.selectionBoxService.dropItems(id);
    }

    stopDragging(): void {
        this.ref.nativeElement?.classList.remove('dragging-item');

        this._selected.forEach(item => {
            item.classList.remove('selection-placeholder');
        });

        this._draggingPlaceholder.destroy();
        this._draggingItem = false;
    }

    selectItem(item: ElementRef<any>): void {
        this._selected.add(item.nativeElement);
        item.nativeElement.classList.add('selected');
    }

    deselectItem(item: ElementRef<any>): void {
        this._selected.delete(item.nativeElement);
        item.nativeElement.classList.remove('selected');
    }

    toggleItem(item: ElementRef<any>): void {
        if (this._selected.has(item.nativeElement)) {
            this.deselectItem(item);
        } else {
            this.selectItem(item);
        }
    }

    clearSelected(): void {
        this._selected.forEach(item => {
            item.classList.remove('selected');
        });
        this._selected.clear();
    }

    getFirstIndex(item: ElementRef<any>): void {
        this.queryItems.some((i, index) => {
            const is = i === item;
            if (is)
                this._firstSelectedIndex = index;

            return is;
        });
    }

    shiftSelect(event: MouseEvent): void {
        let selected: number = -1;
        const someSelected = this.queryItems.some((item, index) => {
            const over = this.checkMouseOver(event, item.nativeElement);
            if (over)
                selected = index;

            return over;
        });

        if (someSelected && this._firstSelectedIndex > -1) {
            this.clearSelected();

            let first: number = this._firstSelectedIndex;
            let last: number = selected;

            if (last - first < 0) {
                first = last;
                last = this._firstSelectedIndex;
            }

            for (let i = first; i <= last; i++) {
                const item = this.queryItems.get(i);

                if (item)
                    this.selectItem(item);
            }
        }
    }
}
