import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RekapPresensiPage } from './rekap.presensi.page';

describe('RekapPresensiPage', () => {
  let component: RekapPresensiPage;
  let fixture: ComponentFixture<RekapPresensiPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RekapPresensiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
