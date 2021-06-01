import { Component, OnInit } from '@angular/core';
import { AuthenticationService, JWT_NAME } from 'src/app/services/authentication-service/authentication.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import decode from 'jwt-decode';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  invalid: boolean;

  constructor(
    private authService: AuthenticationService,
    private router: Router

    ) { }

  getId(): number {
    const token = localStorage.getItem(JWT_NAME);
    const tokenPayload: any = decode(token);
    return tokenPayload.user.id;
  }

  ngOnInit(): void {
    this.invalid = false;
    this.loginForm = new FormGroup({
      username: new FormControl(null, [
        Validators.required
      ]),
      password: new FormControl(null, [
        Validators.required
      ])
    }) 
  }

  onSubmit() {
    this.authService.login(this.loginForm.value).pipe(
      catchError(err => {
          this.invalid = true;
          return throwError(err);
      })
    ).subscribe(
      () => {
        this.router.navigate(['users/'+this.getId()]);
      }
    );
  } 
    
}
