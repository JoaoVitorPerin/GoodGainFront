import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroGenericoComponent } from './cadastro-generico.component';
import { beforeEach, describe, it } from 'node:test';

describe('CadastroGenericoComponent', () => {
  let component: CadastroGenericoComponent;
  let fixture: ComponentFixture<CadastroGenericoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastroGenericoComponent]
    });
    fixture = TestBed.createComponent(CadastroGenericoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
