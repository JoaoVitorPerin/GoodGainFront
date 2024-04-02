import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroTelasComponent } from './cadastro-telas.component';

describe('CadastroTelasComponent', () => {
  let component: CadastroTelasComponent;
  let fixture: ComponentFixture<CadastroTelasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroTelasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastroTelasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
