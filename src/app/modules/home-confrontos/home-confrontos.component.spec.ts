import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeConfrontosComponent } from './home-confrontos.component';

describe('HomeConfrontosComponent', () => {
  let component: HomeConfrontosComponent;
  let fixture: ComponentFixture<HomeConfrontosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeConfrontosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeConfrontosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
