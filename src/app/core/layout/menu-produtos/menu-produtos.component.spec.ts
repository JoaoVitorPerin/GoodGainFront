import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuProdutosComponent } from './menu-produtos.component';

describe('MenuProdutosComponent', () => {
  let component: MenuProdutosComponent;
  let fixture: ComponentFixture<MenuProdutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuProdutosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuProdutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
