import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogsSiswaPage } from './logs.siswa.page';

describe('LogsSiswaPage', () => {
  let component: LogsSiswaPage;
  let fixture: ComponentFixture<LogsSiswaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LogsSiswaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
