import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroPerfisComponent } from './cadastro-perfis.component';

describe('CadastroPerfisComponent', () => {
  let component: CadastroPerfisComponent;
  let fixture: ComponentFixture<CadastroPerfisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroPerfisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastroPerfisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
