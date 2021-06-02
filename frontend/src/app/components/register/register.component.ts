import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user-service/user.service';
import { Observable, of, Subscription, throwError } from 'rxjs';
import { User } from 'src/app/model/user.interface';

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

    if(password !== confirmPassword || confirmPassword === null || password === null) {
      return {passwordsNotMatching: true};
    }
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  invalid: any;


  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: [null, [
        Validators.required,
        Validators.minLength(3)
        
      ]],
      password: [null, [
        Validators.required,
        Validators.minLength(8),
        CustomValidators.passwordContainsNumber
      ]],
      confirmPassword: [null, [Validators.required]]
    },{
      validator: CustomValidators.passwordsMatch
    })
  }

  onSubmit(){
    this.userService.checkUsername(this.registerForm.get('username').value).subscribe(
      result => {
        if(result){
          this.invalid = true;
          return;
        }
        else{
          this.authService.register(this.registerForm.value).subscribe();
          this.router.navigate(['login']);
        }
      }
    );
  }
}
