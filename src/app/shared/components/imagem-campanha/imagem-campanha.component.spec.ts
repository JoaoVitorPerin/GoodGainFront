import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagemCampanhaComponent } from './imagem-campanha.component';

describe('ImagemCampanhaComponent', () => {
  let component: ImagemCampanhaComponent;
  let fixture: ComponentFixture<ImagemCampanhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagemCampanhaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImagemCampanhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
