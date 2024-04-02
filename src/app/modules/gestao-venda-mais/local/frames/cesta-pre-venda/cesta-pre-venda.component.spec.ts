import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CestaPreVendaComponent } from './cesta-pre-venda.component';

describe('CestaPreVendaComponent', () => {
  let component: CestaPreVendaComponent;
  let fixture: ComponentFixture<CestaPreVendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CestaPreVendaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CestaPreVendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
