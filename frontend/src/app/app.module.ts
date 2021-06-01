import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { JwtHelperService, JWT_OPTIONS } from "@auth0/angular-jwt";
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar'; 
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MarkdownModule } from 'ngx-markdown';
import { AdminViewComponent } from './components/admin/admin-view/admin-view.component';
import { CreateNoteComponent } from './components/note/create-note/create-note.component';
import { UpdateNoteComponent } from './components/note/update-note/update-note.component';
import { WINDOW_PROVIDERS } from './window-token';
import { RoleGuardService } from './guards/role-guard-service/role-guard-service.service';
import { UsersNotesComponent } from './components/note/users-notes/users-notes.component';
import { UpdateUserAdminComponent } from './components/admin/update-user-admin/update-user-admin.component';
import { OptionsComponent } from './components/options/options.component';
import { AllNotesComponent } from './components/note/all-notes/all-notes.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatDialogModule} from '@angular/material/dialog';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AdminViewComponent,
    OptionsComponent,
    CreateNoteComponent,
    UpdateNoteComponent,
    UsersNotesComponent,
    UpdateUserAdminComponent,
    AllNotesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSidenavModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FlexLayoutModule,
    MatDialogModule,
    MarkdownModule.forRoot()
  ],
  providers: [
    {provide : LocationStrategy , useClass: HashLocationStrategy},
    RoleGuardService,
    WINDOW_PROVIDERS,
    JwtHelperService, 
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
