import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailPricesComponent } from './product-detail-prices.component';

describe('ProductDetailPricesComponent', () => {
  let component: ProductDetailPricesComponent;
  let fixture: ComponentFixture<ProductDetailPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDetailPricesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
