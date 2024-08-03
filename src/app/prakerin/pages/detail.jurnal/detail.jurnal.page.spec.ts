import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailJurnalPage } from './detail.jurnal.page';

describe('DetailJurnalPage', () => {
  let component: DetailJurnalPage;
  let fixture: ComponentFixture<DetailJurnalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetailJurnalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
