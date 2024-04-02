import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CestaResumoComponent } from './cesta-resumo.component';

describe('CestaResumoComponent', () => {
  let component: CestaResumoComponent;
  let fixture: ComponentFixture<CestaResumoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CestaResumoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CestaResumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
