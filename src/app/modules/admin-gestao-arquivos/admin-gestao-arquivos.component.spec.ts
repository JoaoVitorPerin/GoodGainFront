import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGestaoArquivosComponent } from './admin-gestao-arquivos.component';

describe('AdminGestaoArquivosComponent', () => {
  let component: AdminGestaoArquivosComponent;
  let fixture: ComponentFixture<AdminGestaoArquivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGestaoArquivosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminGestaoArquivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
