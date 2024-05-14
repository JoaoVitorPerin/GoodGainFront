import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardConfrontosComponent } from './card-confrontos.component';

describe('CardConfrontosComponent', () => {
  let component: CardConfrontosComponent;
  let fixture: ComponentFixture<CardConfrontosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardConfrontosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardConfrontosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
