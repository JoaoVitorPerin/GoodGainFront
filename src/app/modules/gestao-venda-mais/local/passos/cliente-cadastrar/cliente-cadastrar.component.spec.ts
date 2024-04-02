import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteCadastrarComponent } from './cliente-cadastrar.component';

describe('ClienteCadastrarComponent', () => {
  let component: ClienteCadastrarComponent;
  let fixture: ComponentFixture<ClienteCadastrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteCadastrarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienteCadastrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
