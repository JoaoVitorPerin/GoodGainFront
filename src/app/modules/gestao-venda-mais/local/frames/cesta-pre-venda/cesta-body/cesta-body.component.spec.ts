import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CestaBodyComponent } from './cesta-body.component';

describe('CestaBodyComponent', () => {
  let component: CestaBodyComponent;
  let fixture: ComponentFixture<CestaBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CestaBodyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CestaBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
