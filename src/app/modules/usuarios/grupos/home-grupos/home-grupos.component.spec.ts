import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeGruposComponent } from './home-grupos.component';

describe('HomeGruposComponent', () => {
  let component: HomeGruposComponent;
  let fixture: ComponentFixture<HomeGruposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeGruposComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
