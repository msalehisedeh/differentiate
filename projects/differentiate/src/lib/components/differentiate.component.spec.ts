import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DifferentiateComponent } from './differentiate.component';

describe('DifferentiateComponent', () => {
  let component: DifferentiateComponent;
  let fixture: ComponentFixture<DifferentiateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DifferentiateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DifferentiateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
