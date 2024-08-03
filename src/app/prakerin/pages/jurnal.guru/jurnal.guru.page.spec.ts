import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JurnalGuruPage } from './jurnal.guru.page';

describe('JurnalGuruPage', () => {
  let component: JurnalGuruPage;
  let fixture: ComponentFixture<JurnalGuruPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JurnalGuruPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
