import { Inject } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { NotesPageable } from 'src/app/model/note.interface';
import { WINDOW } from 'src/app/window-token';

@Component({
  selector: 'app-all-notes',
  templateUrl: './all-notes.component.html',
  styleUrls: ['./all-notes.component.scss']
})
export class AllNotesComponent {

  @Input() notes: NotesPageable;
  @Output() paginate: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  pageEvent: PageEvent;

  origin = this.window.location.origin;

  constructor(private router: Router, @Inject(WINDOW) private window: Window) { }

  onPaginateChange(event: PageEvent) {
    event.pageIndex = event.pageIndex + 1;
    this.paginate.emit(event);
  }

  navigate(id) {
    this.router.navigateByUrl('update/' + id);
  }

}
