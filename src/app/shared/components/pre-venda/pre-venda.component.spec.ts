import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreVendaComponent } from './pre-venda.component';

describe('PreVendaComponent', () => {
  let component: PreVendaComponent;
  let fixture: ComponentFixture<PreVendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreVendaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreVendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
