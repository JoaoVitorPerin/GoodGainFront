import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotaoPrecoComponent } from './botao-preco.component';

describe('BotaoPrecoComponent', () => {
  let component: BotaoPrecoComponent;
  let fixture: ComponentFixture<BotaoPrecoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotaoPrecoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BotaoPrecoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
