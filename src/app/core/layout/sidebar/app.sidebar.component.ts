import { Component, ElementRef, ViewChild } from '@angular/core';
import { LayoutService } from '../app.layout.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html',
    styleUrls: ['./app.sidebar.component.css']
})
export class AppSidebarComponent {
    timeout: any = null;
    isDesktop: boolean = false;

    get getArrowClass() {
        return this.layoutService.state.anchored ? 'pi pi-arrow-left' : 'pi pi-arrow-right';
    }

    @ViewChild('menuContainer') menuContainer!: ElementRef;
    constructor(public layoutService: LayoutService, public el: ElementRef) {
        this.isDesktop = this.layoutService.isDesktop();
    }

    onMouseEnter() {
        if (!this.layoutService.state.anchored) {
            this.layoutService.state.sidebarActive = true;
            this.layoutService.toggleMenu.next(true);
        }
    }

    onMouseLeave() {
        if (!this.layoutService.state.anchored) {
            this.layoutService.state.sidebarActive = false;
            this.layoutService.toggleMenu.next(false);
        }
    }

    anchor() {
        this.layoutService.state.anchored = !this.layoutService.state.anchored;
    }

}
