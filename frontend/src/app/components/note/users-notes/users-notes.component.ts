import { Component, Inject, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Params, ActivatedRoute } from '@angular/router';
import { from, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { FontColor, NotesPageable } from 'src/app/model/note.interface';
import { User } from 'src/app/model/user.interface';
import { Note } from 'src/app/model/note.interface';
import { NoteService } from 'src/app/services/note-service/note.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { WINDOW } from 'src/app/window-token';
import { AuthenticationService, JWT_NAME } from 'src/app/services/authentication-service/authentication.service';
import decode from 'jwt-decode';

@Component({
  selector: 'app-users-notes',
  templateUrl: './users-notes.component.html',
  styleUrls: ['./users-notes.component.scss']
})
export class UsersNotesComponent{

  fontColor = FontColor;
  fontColors : string[] = [];

  origin = this.window.location.origin;

  userId$: Observable<number> = this.activatedRoute.params.pipe(
    map((params: Params) => parseInt(params['id']))
  )

  user$: Observable<User> = this.userId$.pipe(
    switchMap((userId: number) => this.userService.findOne(userId))
  )

  notes$: Observable<NotesPageable> = this.userId$.pipe(
    switchMap((userId: number) => this.noteService.indexByUser(userId, 1, 5))
  )

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private noteService: NoteService,
    @Inject(WINDOW) private window: Window
  ) { }

  onPaginateChange(event: PageEvent) {
    return this.userId$.pipe(
      tap((userId: number) => this.notes$ = this.noteService.indexByUser(userId, event.pageIndex, event.pageSize))
    ).subscribe();
  }
}
