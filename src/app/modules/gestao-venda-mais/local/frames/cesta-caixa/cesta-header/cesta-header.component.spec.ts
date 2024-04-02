import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CestaHeaderComponent } from './cesta-header.component';

describe('CestaHeaderComponent', () => {
  let component: CestaHeaderComponent;
  let fixture: ComponentFixture<CestaHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CestaHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CestaHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
