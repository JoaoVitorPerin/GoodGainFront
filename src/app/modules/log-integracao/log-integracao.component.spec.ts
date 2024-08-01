import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogIntegracaoComponent } from './log-integracao.component';

describe('LogIntegracaoComponent', () => {
  let component: LogIntegracaoComponent;
  let fixture: ComponentFixture<LogIntegracaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogIntegracaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogIntegracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
