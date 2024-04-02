import { Component, ElementRef, HostBinding, Input, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { Subscription } from 'rxjs';
import { DomHandler } from 'primeng/dom';
import { LayoutService } from '../../app.layout.service';
import { MenuService } from '../app.menu.service';

@Component({
  selector: '[app-menuitem]',
  templateUrl: './app.menuitem.component.html',
  styleUrls: ['./app.menuitem.component.css'],
  animations: [
    trigger('children', [
      state('collapsed', style({
        height: '0'
      })),
      state('expanded', style({
        height: '*'
      })),
      transition('collapsed <=> expanded', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class AppMenuitemComponent implements OnInit {

  @Input() item: any;

  @Input() index!: number;

  @Input() @HostBinding('class.layout-root-menuitem') root!: boolean;

  @Input() parentKey!: string;

  @ViewChild('submenu') submenu!: ElementRef;

  active = false;

  menuSourceSubscription: Subscription;

  menuResetSubscription: Subscription;

  key: string = "";

  constructor(public layoutService: LayoutService,
              public router: Router,
              private menuService: MenuService) {
  }

  ngOnInit() {
    this.active = this.root ? true : false;

    this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);

    if (!(this.isSlimPlus || this.isSlim || this.isHorizontal) && this.item.routerLink) {
      this.updateActiveStateFromRoute();
    }

    if (this.item?.icon?.includes('pi-')) {
      this.item.icon = 'pi ' + this.item.icon
    } else {
      this.item.icon_material = true
    }
  }

  ngAfterViewChecked() {
    if (this.root && this.active && this.layoutService.isDesktop() && (this.layoutService.isHorizontal() || this.layoutService.isSlim() || this.layoutService.isSlimPlus())) {
      this.calculatePosition(this.submenu?.nativeElement, this.submenu?.nativeElement.parentElement);
    }
  }

  updateActiveStateFromRoute() {
    const activeRoute = this.router.isActive(this.item.routerLink[0], { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' });
    if (activeRoute) {
      this.menuService.onMenuStateChange({ key: this.key, routeEvent: true });
    }
  }

  onSubmenuAnimated(event: AnimationEvent) {
    if (event.toState === 'visible' && this.layoutService.isDesktop() && (this.layoutService.isHorizontal() || this.layoutService.isSlim() || this.layoutService.isSlimPlus())) {
      const el = <HTMLUListElement>event.element;
      const elParent = <HTMLUListElement>el.parentElement;
      this.calculatePosition(el, elParent);
    }
  }

  calculatePosition(overlay: HTMLElement, target: HTMLElement) {
    if (overlay) {
      const { left, top } = target.getBoundingClientRect();
      const [vWidth, vHeight] = [window.innerWidth, window.innerHeight];
      const [oWidth, oHeight] = [overlay.offsetWidth, overlay.offsetHeight];
      const scrollbarWidth = DomHandler.calculateScrollbarWidth();
      // reset
      overlay.style.top = '';
      overlay.style.left = '';

      if (this.layoutService.isHorizontal()) {
        const width = left + oWidth + scrollbarWidth;
        overlay.style.left = vWidth < width ? `${left - (width - vWidth)}px` : `${left}px`;
      } else if (this.layoutService.isSlim() || this.layoutService.isSlimPlus()) {
        const height = top + oHeight;
        overlay.style.top = vHeight < height ? `${top - (height - vHeight)}px` : `${top}px`;
      }
    }
  }

  itemClick(ev: Event, atalhoEv?: any) {

    const event = atalhoEv ?? ev

    if (this.item.disabled) {
      event.preventDefault();
      return;
    }

    // navigate with hover
    if (this.root && this.isSlim || this.isHorizontal || this.isSlimPlus) {
      this.layoutService.state.menuHoverActive = !this.layoutService.state.menuHoverActive;
    }

    // execute command
    if (this.item.command) {
      this.item.command({ originalEvent: event, item: this.item });
    }

    // toggle active state
    if (this.item.items.length) {
      this.active = !this.active;
      if (this.root && this.active && (this.isSlim || this.isHorizontal || this.isSlimPlus)) {
        this.layoutService.onOverlaySubmenuOpen();
      }
    } else {
      if (this.layoutService.isMobile()) {
        this.layoutService.state.staticMenuMobileActive = false;
      }

      if (this.isSlim || this.isHorizontal || this.isSlimPlus) {
        this.layoutService.state.menuHoverActive = false;
      }
    }

    this.menuService.onMenuStateChange({ key: this.key });
  }

  onMouseEnter() {
    // activate item on hover
    if (this.root && (this.isSlim || this.isHorizontal || this.isSlimPlus) && this.layoutService.isDesktop()) {
      if (this.layoutService.state.menuHoverActive) {
        this.active = true;
        this.menuService.onMenuStateChange({ key: this.key });
      }
    }
  }

  get submenuAnimation() {
    return this.active ? 'expanded' : 'collapsed'
  }

  get isHorizontal() {
    return this.layoutService.isHorizontal();
  }

  get isSlim() {
    return this.layoutService.isSlim();
  }

  get isSlimPlus() {
    return this.layoutService.isSlimPlus();
  }

}
