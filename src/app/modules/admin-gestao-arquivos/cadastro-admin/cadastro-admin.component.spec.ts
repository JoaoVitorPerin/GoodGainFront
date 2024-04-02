import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroAdminComponent } from './cadastro-admin.component';

describe('CadastroAdminComponent', () => {
  let component: CadastroAdminComponent;
  let fixture: ComponentFixture<CadastroAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastroAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
