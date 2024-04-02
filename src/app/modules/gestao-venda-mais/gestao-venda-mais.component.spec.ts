import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestaoVendaMaisComponent } from './gestao-venda-mais.component';

describe('GestaoVendaMaisComponent', () => {
  let component: GestaoVendaMaisComponent;
  let fixture: ComponentFixture<GestaoVendaMaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestaoVendaMaisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestaoVendaMaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
