import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from 'src/app/model/user.interface';

export interface UserData {
  items: User[],
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  }, 
  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  }
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  findOne(id: number): Observable<User> {
    return this.http.get('https://subsadmin-api.herokuapp.com/api/users/' + id).pipe(
      map((user:User) => user)
    )
  }

  findOneAdmin(id: number): Observable<User> {
    return this.http.get('https://subsadmin-api.herokuapp.com/api/users/' + id +'/admin').pipe(
      map((user:User) => user)
    )
  }

  updateOne(user): Observable<User> {
    return this.http.put('https://subsadmin-api.herokuapp.com/api/users/' + user.id, user);
  }

  updateOnePassword(user): Observable<User> {
    return this.http.put('https://subsadmin-api.herokuapp.com/api/users/' + user.id + '/password', user);
  }

  updateOneAdmin(user): Observable<User> {
    return this.http.put('https://subsadmin-api.herokuapp.com/api/users/' + user.id + '/admin', user);
  }

  deleteOne(id: number): Observable<User> {
    return this.http.delete('https://subsadmin-api.herokuapp.com/api/users/' + id).pipe(
      map((user:User) => user)
    )
  }

  findAll(page: number, size: number): Observable<UserData> {
    let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(size));

    return this.http.get('https://subsadmin-api.herokuapp.com/api/users', {params}).pipe(
      map((userData: UserData) => userData),
      catchError(err => throwError(err))
    )
  }

  paginateByName(page: number, size: number, username: string): Observable<UserData> {
    let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(size));

    return this.http.get(`https://subsadmin-api.herokuapp.com/api/users/search/by/username/${username}`, {params}).pipe(
      map((userData: UserData) => userData),
      catchError(err => throwError(err))
    )
  }

  checkUsername(user: User): Observable<boolean>{
    return this.http.post<boolean>('https://subsadmin-api.herokuapp.com/api/users/check/username/' + user , user).pipe(
      map((boolean : boolean) => boolean)
    );
  }
}
