import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabecalhoFilialComponent } from './cabecalho-filial.component';

describe('CabecalhoFilialComponent', () => {
  let component: CabecalhoFilialComponent;
  let fixture: ComponentFixture<CabecalhoFilialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabecalhoFilialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CabecalhoFilialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
