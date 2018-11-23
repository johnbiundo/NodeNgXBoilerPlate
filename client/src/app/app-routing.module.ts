import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmComponent } from './account/confirm/confirm.component';
import { ForgotPasswordComponent } from './account/forgot-password/forgot-password.component';
import { LoginComponent } from './account/login/login.component';
import { OAuthComponent } from './account/oauth/oauth.component';
import { ProfileComponent } from './account/profile/profile.component';
import { RegisterComponent } from './account/register/register.component';
import { ResetPasswordComponent } from './account/reset-password/reset-password.component';
import { SsoComponent } from './account/sso/sso.component';
import { AdminShellComponent } from './admin/admin-shell/admin-shell.component';
import { AdminHomeComponent } from './admin/home/home.component';
import { AdminUserDetailComponent } from './admin/users/user-detail/user-detail.component';
import { AdminUsersComponent } from './admin/users/users.component';
import { AdminGuard } from './guards/admin.guard';
import { AnonymousGuard } from './guards/anonymous.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { HomeComponent } from './home/home/home.component';
import { MainComponent } from './home/main/main.component';
import { NotFoundComponent } from './layout/not-found/not-found.component';
import { ServerErrorComponent } from './layout/server-error/server-error.component';
import { UnauthorizedComponent } from './layout/unauthorized/unauthorized.component';
import { UnavailableComponent } from './layout/unavailable/unavailable.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AnonymousGuard],
    data: { title: 'Welcome', hideHeader: true }
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AnonymousGuard],
    data: { title: 'Login', hideHeader: true }
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AnonymousGuard],
    data: { title: 'Register', hideHeader: true }
  },
  {
    path: 'confirm/:searchString',
    component: ConfirmComponent,
    data: { title: 'Confirm Your Account', hideHeader: false }
  },
  {
    path: 'confirm',
    component: ConfirmComponent,
    data: { title: 'Confirm Your Account', hideHeader: false }
  },
  {
    path: 'reset-password/:searchString',
    component: ResetPasswordComponent,
    data: { title: 'Reset Your Password', hideHeader: false }
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    data: { title: 'Reset Your Password', hideHeader: false }
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: { title: 'Forgot Password', hideHeader: false }
  },
  {
    path: 'oauth/:provider',
    component: OAuthComponent,
    data: { title: 'Link Account', hideHeader: false }
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthenticatedGuard],
    data: { title: 'Home' }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthenticatedGuard],
    data: { title: 'Profile' }
  },
  {
    path: 'profile/:state',
    component: ProfileComponent,
    canActivate: [AuthenticatedGuard],
    data: { title: 'Profile' }
  },
  {
    path: 'admin',
    component: AdminShellComponent,
    canActivate: [AdminGuard],
    data: { title: 'Admin' },
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: AdminHomeComponent,
        canActivate: [AdminGuard],
        data: { title: 'Admin - Home' }
      },
      {
        path: 'users',
        component: AdminUsersComponent,
        canActivate: [AdminGuard],
        data: { title: 'Admin - Users' }
      },
      {
        path: 'user/:id',
        component: AdminUserDetailComponent,
        canActivate: [AdminGuard],
        data: { title: 'Admin - User Detail' }
      }
    ]
  },
  {
    path: 'sso',
    component: SsoComponent,
    data: { title: 'Single Sign On' }
  },
  {
    path: 'error',
    component: ServerErrorComponent,
    data: { title: 'Error' }
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
    data: { title: 'Unauthorized' }
  },
  {
    path: 'maintenance',
    component: UnavailableComponent,
    data: { title: 'Maintenance' }
  },
  {
    path: '**',
    component: NotFoundComponent,
    data: { title: 'Not Found' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
