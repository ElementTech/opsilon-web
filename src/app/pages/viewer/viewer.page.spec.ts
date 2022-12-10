import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ViewerPage } from './viewer.page';

describe('ViewerPage', () => {
  let component: ViewerPage;
  let fixture: ComponentFixture<ViewerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewerPage, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
