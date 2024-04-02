import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu-perfil',
  templateUrl: './menu-perfil.component.html',
  styleUrl: './menu-perfil.component.css'
})
export class MenuPerfilComponent {
  @Input({required: true}) items: MenuItem[] | [];
}
