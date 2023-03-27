import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAbiComponent } from './list-abi.component';

describe('ListAbiComponent', () => {
  let component: ListAbiComponent;
  let fixture: ComponentFixture<ListAbiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAbiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAbiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
