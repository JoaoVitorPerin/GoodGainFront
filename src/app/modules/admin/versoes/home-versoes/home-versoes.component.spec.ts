import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeVersoesComponent } from './home-versoes.component';

describe('HomeVersoesComponent', () => {
  let component: HomeVersoesComponent;
  let fixture: ComponentFixture<HomeVersoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeVersoesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeVersoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
