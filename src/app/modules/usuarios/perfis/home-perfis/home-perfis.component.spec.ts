import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePerfisComponent } from './home-perfis.component';

describe('HomePerfisComponent', () => {
  let component: HomePerfisComponent;
  let fixture: ComponentFixture<HomePerfisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePerfisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomePerfisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
