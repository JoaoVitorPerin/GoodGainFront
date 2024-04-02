import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrosselProdutosComponent } from './carrossel-produtos.component';

describe('CarrosselProdutosComponent', () => {
  let component: CarrosselProdutosComponent;
  let fixture: ComponentFixture<CarrosselProdutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrosselProdutosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarrosselProdutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
