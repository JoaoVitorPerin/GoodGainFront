import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteCadastradoComponent } from './cliente-cadastrado.component';

describe('ClienteCadastradoComponent', () => {
  let component: ClienteCadastradoComponent;
  let fixture: ComponentFixture<ClienteCadastradoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteCadastradoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienteCadastradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
