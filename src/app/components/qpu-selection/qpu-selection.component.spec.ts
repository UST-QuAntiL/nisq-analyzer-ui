import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QpuSelectionComponent } from './qpu-selection.component';

describe('QpuSelectionComponent', () => {
  let component: QpuSelectionComponent;
  let fixture: ComponentFixture<QpuSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QpuSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QpuSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
