import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RekapabsensiPage } from './rekapabsensi.page';

describe('RekapabsensiPage', () => {
  let component: RekapabsensiPage;
  let fixture: ComponentFixture<RekapabsensiPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RekapabsensiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
