import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PresensiptkPage } from './presensiptk.page';

describe('PresensiptkPage', () => {
  let component: PresensiptkPage;
  let fixture: ComponentFixture<PresensiptkPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PresensiptkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
