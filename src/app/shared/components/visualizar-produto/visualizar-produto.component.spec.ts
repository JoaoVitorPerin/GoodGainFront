import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarProdutoComponent } from './visualizar-produto.component';

describe('VisualizarProdutoComponent', () => {
  let component: VisualizarProdutoComponent;
  let fixture: ComponentFixture<VisualizarProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarProdutoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisualizarProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
