import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstoqueLocalComponent } from './estoque-local.component';

describe('EstoqueLocalComponent', () => {
  let component: EstoqueLocalComponent;
  let fixture: ComponentFixture<EstoqueLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstoqueLocalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstoqueLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
