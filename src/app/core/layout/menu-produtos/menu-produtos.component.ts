import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu-produtos',
  templateUrl: './menu-produtos.component.html',
  styleUrl: './menu-produtos.component.css'
})
export class MenuProdutosComponent{
  @Input({required: true}) items: MenuItem[] | [];
}
