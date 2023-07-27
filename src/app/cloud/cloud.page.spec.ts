import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CloudPage } from './cloud.page';

describe('CloudPage', () => {
  let component: CloudPage;
  let fixture: ComponentFixture<CloudPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CloudPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
