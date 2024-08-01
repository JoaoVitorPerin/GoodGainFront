import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosCadastroComponent } from './usuarios-cadastro.component';

describe('UsuariosCadastroComponent', () => {
  let component: UsuariosCadastroComponent;
  let fixture: ComponentFixture<UsuariosCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosCadastroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsuariosCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
