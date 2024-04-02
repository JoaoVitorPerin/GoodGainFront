import { TestBed } from '@angular/core/testing';

import { VisualizarProdutoService } from './visualizar-produto.service';

describe('VisualizarProdutoService', () => {
  let service: VisualizarProdutoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisualizarProdutoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
