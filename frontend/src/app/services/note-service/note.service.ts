import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotesPageable, Note } from 'src/app/model/note.interface';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpClient) { }

  findOne(id: number): Observable<Note> {
    return this.http.get<Note>('https://subsadmin-api.herokuapp.com/api/note/' + id);
  }

  indexAll(page: number, limit: number): Observable<NotesPageable> {
    let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(limit));

    return this.http.get<NotesPageable>('https://subsadmin-api.herokuapp.com/api/note', {params});
  }

  indexByUser(userId: number, page: number, limit: number): Observable<NotesPageable> {
    let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(limit));

    return this.http.get<NotesPageable>('https://subsadmin-api.herokuapp.com/api/note/user/' + String(userId), {params});
  }

  findByUser(userId: number){
    return this.http.get<Note[]>('https://subsadmin-api.herokuapp.com/api/note/find/user/' + userId);
  }

  post(note: Note): Observable<Note> {
    return this.http.post<Note>('https://subsadmin-api.herokuapp.com/api/note', note);
  }

  updateOne(note: Note): Observable<Note>{
    return this.http.put<Object>('https://subsadmin-api.herokuapp.com/api/note/' + note.id, note);
  }

  deleteOne(note: Note){
    return this.http.delete<Note>('https://subsadmin-api.herokuapp.com/api/note/' + note.id);
  }

}
