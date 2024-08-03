import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailPresensiPage } from './detail.presensi.page';

describe('DetailPresensiPage', () => {
  let component: DetailPresensiPage;
  let fixture: ComponentFixture<DetailPresensiPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetailPresensiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
