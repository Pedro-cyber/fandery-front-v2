import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailAnalyticsComponent } from './product-detail-analytics.component';

describe('ProductDetailAnalyticsComponent', () => {
  let component: ProductDetailAnalyticsComponent;
  let fixture: ComponentFixture<ProductDetailAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDetailAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
