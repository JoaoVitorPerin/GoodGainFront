import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarConfrontoComponent } from './visualizar-confronto.component';

describe('VisualizarConfrontoComponent', () => {
  let component: VisualizarConfrontoComponent;
  let fixture: ComponentFixture<VisualizarConfrontoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarConfrontoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisualizarConfrontoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
