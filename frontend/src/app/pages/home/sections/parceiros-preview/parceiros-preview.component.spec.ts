import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParceirosPreviewComponent } from './parceiros-preview.component';

describe('ParceirosPreviewComponent', () => {
  let component: ParceirosPreviewComponent;
  let fixture: ComponentFixture<ParceirosPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParceirosPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParceirosPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
