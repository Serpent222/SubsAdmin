import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, tap, map, catchError } from 'rxjs/operators';
import { User } from 'src/app/model/user.interface';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { WINDOW } from 'src/app/window-token';

@Component({
  selector: 'app-update-user-admin',
  templateUrl: './update-user-admin.component.html',
  styleUrls: ['./update-user-admin.component.scss']
})
export class UpdateUserAdminComponent implements OnInit {

  form: FormGroup;

  origin = this.window.location.origin;

  private userId: Observable<number> = this.activatedRoute.params.pipe(
    map((params: Params) => parseInt(params['id']))
  )

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(WINDOW) private window: Window
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [{value: null, disabled: true}, [Validators.required]],
      username: [{value: null, disabled: true}, [Validators.required]],
      role: [null, [Validators.required]]
    });

    this.userId.pipe(
      switchMap((id: number) => this.userService.findOneAdmin(id).pipe(
        tap((user: User) => {
          this.form.patchValue({
            id: user.id,
            username: user.username,
            role: user.role
          })
        })
      ))
    ).subscribe()
  }

  update() {
    this.userService.updateOneAdmin(this.form.getRawValue()).subscribe();
    this.router.navigate(['admin']);
  }
}
