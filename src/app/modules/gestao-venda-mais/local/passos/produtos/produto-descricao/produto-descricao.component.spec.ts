import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoDescricaoComponent } from './produto-descricao.component';

describe('ProdutoDescricaoComponent', () => {
  let component: ProdutoDescricaoComponent;
  let fixture: ComponentFixture<ProdutoDescricaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoDescricaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProdutoDescricaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
