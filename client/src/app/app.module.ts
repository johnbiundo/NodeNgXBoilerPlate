import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MarkdownModule } from 'ngx-markdown';
import { ToastrModule } from 'ngx-toastr';
import { ConfirmComponent } from './account/confirm/confirm.component';
import { ForgotPasswordComponent } from './account/forgot-password/forgot-password.component';
import { LoginComponent } from './account/login/login.component';
import { OAuthComponent } from './account/oauth/oauth.component';
import { ProfileComponent } from './account/profile/profile.component';
import { RegisterComponent } from './account/register/register.component';
import { ResetPasswordComponent } from './account/reset-password/reset-password.component';
import { GenerateApiKeyComponent } from './account/shared/generate-api-key/generate-api-key.component';
import { PasswordInputComponent } from './account/shared/password-input/password-input.component';
import { ProfileFormComponent } from './account/shared/profile-form/profile-form.component';
import { SocialLoginComponent } from './account/shared/social-login/social-login.component';
import { SsoComponent } from './account/sso/sso.component';
import { AdminShellComponent } from './admin/admin-shell/admin-shell.component';
import { AdminHomeComponent } from './admin/home/home.component';
import { AdminNavComponent } from './admin/shared/nav/nav.component';
import { AdminUserDetailComponent } from './admin/users/user-detail/user-detail.component';
import { AdminUsersComponent } from './admin/users/users.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoToLinkDirective } from './directives/go-to-link.directive';
import { AdminGuard } from './guards/admin.guard';
import { AnonymousGuard } from './guards/anonymous.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { HomeComponent } from './home/home/home.component';
import { MainComponent } from './home/main/main.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { NotFoundComponent } from './layout/not-found/not-found.component';
import { ServerErrorComponent } from './layout/server-error/server-error.component';
import { UnauthorizedComponent } from './layout/unauthorized/unauthorized.component';
import { UnavailableComponent } from './layout/unavailable/unavailable.component';
import { AuthInterceptor } from './middleware/auth.interceptor';
import { HeaderInterceptor } from './middleware/header.interceptor';
import { LogInterceptor } from './middleware/logger.interceptor';
import { LinkPipe } from './pipes/link.pipe';
import { SlugifyPipe } from './pipes/slugify.pipe';
import { AccountService } from './services/account.service';
import { AppService } from './services/app.service';
import { LinksService } from './services/links.service';
import { OAuthService } from './services/oauth.service';
import { CloudMediaValidatorDirective } from './shared/directives/cloud-media-validator.directive';
import { EmailAvailableDirective } from './shared/directives/email-available.directive';
import { StrongPasswordModule } from './shared/strong-password/strong-password.module';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    MainComponent,
    ConfirmComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    ServerErrorComponent,
    NotFoundComponent,
    EmailAvailableDirective,
    HomeComponent,
    ProfileComponent,
    GenerateApiKeyComponent,
    ProfileFormComponent,
    PasswordInputComponent,
    SsoComponent,
    UnavailableComponent,
    OAuthComponent,
    SocialLoginComponent,
    AdminHomeComponent,
    UnauthorizedComponent,
    AdminNavComponent,
    AdminUsersComponent,
    AdminShellComponent,
    AdminUserDetailComponent,
    SlugifyPipe,
    CloudMediaValidatorDirective,
    LinkPipe,
    GoToLinkDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    StrongPasswordModule,
    NgbModule.forRoot(),
    TagInputModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MarkdownModule.forRoot(),
    InfiniteScrollModule,
    FontAwesomeModule,
  ],
  providers: [
    AccountService,
    LinksService,
    OAuthService,
    AppService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthenticatedGuard,
    AnonymousGuard,
    AdminGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LogInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
platformBrowserDynamic().bootstrapModule(AppModule);
