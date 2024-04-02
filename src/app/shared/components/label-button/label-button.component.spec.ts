import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelButtonComponent } from './label-button.component';

describe('LabelButtonComponent', () => {
  let component: LabelButtonComponent;
  let fixture: ComponentFixture<LabelButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LabelButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
