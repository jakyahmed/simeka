import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrakerinHomePage } from './prakerin.home.page';

describe('PrakerinHomePage', () => {
  let component: PrakerinHomePage;
  let fixture: ComponentFixture<PrakerinHomePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PrakerinHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
