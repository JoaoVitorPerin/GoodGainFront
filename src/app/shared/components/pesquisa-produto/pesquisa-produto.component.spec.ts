import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PesquisaProdutoComponent } from './pesquisa-produto.component';

describe('PesquisaProdutoComponent', () => {
  let component: PesquisaProdutoComponent;
  let fixture: ComponentFixture<PesquisaProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PesquisaProdutoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PesquisaProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
