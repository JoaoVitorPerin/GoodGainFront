import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CestaFooterComponent } from './cesta-footer.component';

describe('CestaFooterComponent', () => {
  let component: CestaFooterComponent;
  let fixture: ComponentFixture<CestaFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CestaFooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CestaFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
