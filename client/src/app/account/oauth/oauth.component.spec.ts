import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { OAuthComponent } from './oauth.component';


describe('OauthComponent', () => {
  let component: OAuthComponent;
  let fixture: ComponentFixture<OAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
