import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetSiswaPage } from './reset.siswa.page';

describe('ResetSiswaPage', () => {
  let component: ResetSiswaPage;
  let fixture: ComponentFixture<ResetSiswaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ResetSiswaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
