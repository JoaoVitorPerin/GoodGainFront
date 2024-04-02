import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroGruposComponent } from './cadastro-grupos.component';

describe('CadastroGruposComponent', () => {
  let component: CadastroGruposComponent;
  let fixture: ComponentFixture<CadastroGruposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroGruposComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastroGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
