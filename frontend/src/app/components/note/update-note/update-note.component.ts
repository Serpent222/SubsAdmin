import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { FontColor, Note } from 'src/app/model/note.interface';
import { AuthenticationService, JWT_NAME } from 'src/app/services/authentication-service/authentication.service';
import { NoteService } from 'src/app/services/note-service/note.service';
import { WINDOW } from 'src/app/window-token';
import decode from 'jwt-decode';

@Component({
  selector: 'app-update-note',
  templateUrl: './update-note.component.html',
  styleUrls: ['./update-note.component.scss']
})
export class UpdateNoteComponent {

  getNoteId = this.activatedRoute.snapshot.paramMap.get('id');
  noteId: number = +this.activatedRoute.snapshot.paramMap.get('id');

  fontColor = FontColor;
  fontColors : string[] = [];

  form: FormGroup;

  origin = this.window.location.origin;

  constructor(
    private formBuilder: FormBuilder,
    private noteService: NoteService,
    private router: Router,
    private authService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    @Inject(WINDOW) private window: Window
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [{value: null, disabled: true}],
      title: [null, [Validators.required]],
      text: [null, [Validators.required]],
      background_color: [null, [Validators.required]],
      font_color: [null, [Validators.required]]
    }),

    this.noteService.findOne(this.noteId).pipe(
      tap((note: Note) => {
        this.form.patchValue({
          id: note.id,
          title: note.title,
          text: note.text,
          font_color: note.font_color,
          background_color: note.background_color
        })
      })
    ).subscribe(),

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

  update() {
    this.noteService.updateOne(this.form.getRawValue()).pipe(
      tap(() => this.router.navigate(['/users/'+ this.getId()]))
    ).subscribe();
  }

  delete(){
    this.noteService.deleteOne(this.form.getRawValue()).pipe(
      tap(() => this.router.navigate(['/users/'+ this.getId()]))
    ).subscribe();
  }

}
