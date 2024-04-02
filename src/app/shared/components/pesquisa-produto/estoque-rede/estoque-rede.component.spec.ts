import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstoqueRedeComponent } from './estoque-rede.component';

describe('EstoqueRedeComponent', () => {
  let component: EstoqueRedeComponent;
  let fixture: ComponentFixture<EstoqueRedeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstoqueRedeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstoqueRedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
