import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickLinksSectionComponent } from './quick-links.component';

describe('QuickLinksSectionComponent', () => {
  let component: QuickLinksSectionComponent;
  let fixture: ComponentFixture<QuickLinksSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickLinksSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuickLinksSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

