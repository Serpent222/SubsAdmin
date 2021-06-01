import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth-guard/auth.guard';
import { RoleGuardService as RoleGuard} from './guards/role-guard-service/role-guard-service.service';
import { AdminViewComponent } from './components/admin/admin-view/admin-view.component';
import { OptionsComponent } from './components/options/options.component';
import { CreateNoteComponent } from './components/note/create-note/create-note.component';
import { UpdateNoteComponent } from './components/note/update-note/update-note.component';
import { UsersNotesComponent } from './components/note/users-notes/users-notes.component';
import { UpdateUserAdminComponent } from './components/admin/update-user-admin/update-user-admin.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'users/:id',
    component: UsersNotesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    canActivate: [RoleGuard],
    data:{ 
      expectedRole: 'admin'
    },
    children: [
      {
        path: '',
        component: AdminViewComponent
      },
      {
        path: ':id',
        component: UpdateUserAdminComponent
      },
    ]
  },
  {
    path: 'options',
    component: OptionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'update/:id',
    component: UpdateNoteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'create',
    component: CreateNoteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
