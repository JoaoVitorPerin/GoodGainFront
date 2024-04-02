import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroMenusComponent } from './cadastro-menus.component';

describe('CadastroMenusComponent', () => {
  let component: CadastroMenusComponent;
  let fixture: ComponentFixture<CadastroMenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroMenusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastroMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
