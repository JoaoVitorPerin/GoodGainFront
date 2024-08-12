import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanoUsuarioComponent } from './plano-usuario.component';

describe('PlanoUsuarioComponent', () => {
  let component: PlanoUsuarioComponent;
  let fixture: ComponentFixture<PlanoUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanoUsuarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlanoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
