import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthenticationService, JWT_NAME } from 'src/app/services/authentication-service/authentication.service';
import { NoteService } from 'src/app/services/note-service/note.service';
import { WINDOW } from 'src/app/window-token';
import decode from 'jwt-decode';
import { FontColor } from 'src/app/model/note.interface';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.scss']
})
export class CreateNoteComponent implements OnInit {

  fontColor = FontColor;
  fontColors : string[] = [];
  
  form: FormGroup;

  origin = this.window.location.origin;

  constructor(
    private formBuilder: FormBuilder,
    private noteService: NoteService,
    private router: Router,
    private authService: AuthenticationService,
    @Inject(WINDOW) private window: Window
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [{value: null, disabled: true}],
      title: [null, [Validators.required]],
      text: [null, [Validators.required]],
      font_color: [null, [Validators.required]],
      background_color: [null, [Validators.required]]
    }),

    this.form.controls['background_color'].setValue('#424242');
    this.form.controls['font_color'].setValue('white');

    Object.entries(this.fontColor).forEach(([key, value]) => { this.fontColors.push(String(value)); });
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

  post() {
    this.noteService.post(this.form.getRawValue()).pipe(
      tap(() => this.router.navigate(['/users/'+ this.getId()]))
    ).subscribe();
  }
}
