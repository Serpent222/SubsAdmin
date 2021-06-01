import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthenticationService, JWT_NAME } from 'src/app/services/authentication-service/authentication.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { switchMap, tap, map, catchError } from 'rxjs/operators';
import { HttpEventType, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { User } from 'src/app/model/user.interface';
import { WINDOW } from 'src/app/window-token';
import { Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import decode from 'jwt-decode';

export interface File {
  data: any;
  progress: number;
  inProgress: boolean;
}

class CustomValidators {

  static passwordContainsNumber(control: AbstractControl): ValidationErrors {
    const regex= /\d/;

    if(regex.test(control.value) && control.value !== null) {
      return null;
    } else {
      return {passwordInvalid: true};
    }
  }

  static passwordsMatch (control: AbstractControl): ValidationErrors {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;

    if((password === confirmPassword) && (password !== null && confirmPassword !== null)) {
      return null;
    } else {
      return {passwordsNotMatching: true};
    }
  }
}

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {

  usernameForm: FormGroup;
  passwordForm: FormGroup;

  origin = this.window.location.origin;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private userService: UserService,
    public dialog: MatDialog,
    @Inject(WINDOW) private window: Window
  ) { }

  ngOnInit(): void {
    this.usernameForm = this.formBuilder.group({
      id: [{value: null, disabled: true}, [Validators.required]],
      username: [null, [
        Validators.required,
        Validators.minLength(3)
      ]]
    });

    this.userService.findOne(this.getId()).pipe(
      tap((user: User) => {
        this.usernameForm.patchValue({
          id: user.id,
          username: user.username
        })
      })
    ).subscribe();

    this.passwordForm = this.formBuilder.group({
      id: [{value: null, disabled: true}, [Validators.required]],
      password: [null, [
        Validators.required,
        Validators.minLength(8),
        CustomValidators.passwordContainsNumber
      ]],
      confirmPassword: [null, [Validators.required]]
    },{
      validator: CustomValidators.passwordsMatch
    });

    
    this.userService.findOne(this.getId()).pipe(
      tap((user: User) => {
        this.passwordForm.patchValue({
          id: user.id,
        })
      })
    ).subscribe();
  }

  getId(): number {
    if(this.authService.isAuthenticated()){
      const token = localStorage.getItem(JWT_NAME);
      const tokenPayload: any = decode(token);
      return tokenPayload.user.id;
    }
    else{
      return;
    }
  }

  updateUsername(){
    this.userService.checkUsername(this.usernameForm.get('username').value).subscribe(
      result => {
        if(result){
          this.dialog.open(UsernameExistsDialog);
          return;
        }
        else{
          this.userService.updateOne(this.usernameForm.getRawValue()).subscribe();
          this.dialog.open(SuccessfullChangesDialog);
        }
      }
    );
  }

  updatePassword() {
    var user: User = {
      id: this.passwordForm.get('id').value,
      password: this.passwordForm.get('password').value
    }

    console.log(user);
    this.userService.updateOnePassword(user).subscribe();
    this.dialog.open(SuccessfullChangesDialog);
  }

}

@Component({
  selector: 'username-exists-dialog',
  templateUrl: '../dialogs/username-exists-dialog.html',
})
export class UsernameExistsDialog {}

@Component({
  selector: 'successfull-changes-dialog',
  templateUrl: '../dialogs/successfull-changes-dialog.html',
})
export class SuccessfullChangesDialog {}