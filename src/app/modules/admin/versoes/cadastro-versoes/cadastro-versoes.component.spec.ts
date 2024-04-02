import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroVersoesComponent } from './cadastro-versoes.component';

describe('CadastroVersoesComponent', () => {
  let component: CadastroVersoesComponent;
  let fixture: ComponentFixture<CadastroVersoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroVersoesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastroVersoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
