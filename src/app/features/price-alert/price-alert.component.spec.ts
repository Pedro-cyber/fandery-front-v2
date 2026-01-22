import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceAlertComponent } from './price-alert.component';

describe('PriceAlertComponent', () => {
  let component: PriceAlertComponent;
  let fixture: ComponentFixture<PriceAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
