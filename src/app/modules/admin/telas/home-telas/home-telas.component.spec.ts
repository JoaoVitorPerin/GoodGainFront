import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTelasComponent } from './home-telas.component';

describe('HomeTelasComponent', () => {
  let component: HomeTelasComponent;
  let fixture: ComponentFixture<HomeTelasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeTelasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeTelasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
