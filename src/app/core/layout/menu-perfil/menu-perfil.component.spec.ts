import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPerfilComponent } from './menu-perfil.component';

describe('MenuPerfilComponent', () => {
  let component: MenuPerfilComponent;
  let fixture: ComponentFixture<MenuPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuPerfilComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
