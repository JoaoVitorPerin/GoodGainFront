import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMenusComponent } from './home-menus.component';

describe('HomeMenusComponent', () => {
  let component: HomeMenusComponent;
  let fixture: ComponentFixture<HomeMenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeMenusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
