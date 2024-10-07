import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampeonatoComponent } from './campeonato.component';

describe('CampeonatoComponent', () => {
  let component: CampeonatoComponent;
  let fixture: ComponentFixture<CampeonatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampeonatoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CampeonatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
