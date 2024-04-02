/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaMensalComponent } from './meta-mensal.component';

describe('MetaMensalComponent', () => {
  let component: MetaMensalComponent;
  let fixture: ComponentFixture<MetaMensalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetaMensalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaMensalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
