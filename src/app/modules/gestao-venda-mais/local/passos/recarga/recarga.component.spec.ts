import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecargaComponent } from './recarga.component';

describe('RecargaComponent', () => {
  let component: RecargaComponent;
  let fixture: ComponentFixture<RecargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecargaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
