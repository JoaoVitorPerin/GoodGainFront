import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { AppLayoutComponent } from './app.layout.component';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from './header/header.component';
import { AppSidebarComponent } from './sidebar/app.sidebar.component';
import { AppMenuComponent } from './menu/app.menu.component';
import { AppMenuitemComponent } from './menu/menu-item/app.menuitem.component';
import { AppConfigModule } from './config/app.config.module';
import { FooterComponent } from './footer/footer.component';
import { AppAsideComponent } from './asidebar/asidebar.component';
import { AvatarModule } from "primeng/avatar";
import { AvatarGroupModule } from "primeng/avatargroup";
import { AtalhoEventoDirective } from "src/app/shared/directives/atalho-evento.directive";
import { DividerModule } from "primeng/divider";
import { TabViewModule } from "primeng/tabview";
import { SubmenuComponent } from './submenu/submenu.component';
import { MenuProdutosComponent } from './menu-produtos/menu-produtos.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuModule } from 'primeng/menu';
import { MenuPerfilComponent } from './menu-perfil/menu-perfil.component';
import { AccordionModule } from 'primeng/accordion';


@NgModule({
    declarations: [
        AppLayoutComponent,
        AppSidebarComponent,
        AppMenuComponent,
        AppAsideComponent,
        AppMenuitemComponent,
        HeaderComponent,
        FooterComponent,
        SubmenuComponent,
        MenuProdutosComponent,
        MenuPerfilComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        InputTextModule,
        SidebarModule,
        BadgeModule,
        RadioButtonModule,
        InputSwitchModule,
        ButtonModule,
        TooltipModule,
        RippleModule,
        RouterModule,
        AppConfigModule,
        AvatarModule,
        AvatarGroupModule,
        AtalhoEventoDirective,
        DividerModule,
        TabViewModule,
        MenubarModule,
        MenuModule,
        PanelMenuModule,
        AccordionModule
    ]
})
export class AppLayoutModule { }
