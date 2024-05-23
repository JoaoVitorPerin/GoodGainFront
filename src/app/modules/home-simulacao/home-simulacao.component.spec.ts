import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSimulacaoComponent } from './home-simulacao.component';

describe('HomeSimulacaoComponent', () => {
  let component: HomeSimulacaoComponent;
  let fixture: ComponentFixture<HomeSimulacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeSimulacaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeSimulacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
