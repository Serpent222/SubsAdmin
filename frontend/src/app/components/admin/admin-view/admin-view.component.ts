import { Component, OnInit } from '@angular/core';
import { UserData, UserService } from 'src/app/services/user-service/user.service';
import { map, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss']
})
export class AdminViewComponent implements OnInit {

  filterValue: string = null;
  dataSource: UserData = null;
  pageEvent: PageEvent;
  displayedColumns: string[] = ['id', 'username', 'role', 'update', 'delete'];

  constructor(private userService: UserService, private authService: AuthenticationService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.findAll(1,10);
  }

  onPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page +1;

    if(this.filterValue === null || this.filterValue === '') {
      this.findAll(page, size);
    } else {
      this.userService.paginateByName(page, size, this.filterValue).pipe(
        map((userData: UserData) => this.dataSource = userData)
      ).subscribe()
    }

  }

  findByName(username: string) {
    if(username === null || username === '') {
      this.findAll(1, 10);
    } else {
      this.userService.paginateByName(1, 10, username).pipe(
        map((userData: UserData) => this.dataSource = userData)
      ).subscribe()  
    }
  }

  findAll(page: number, size: number) {
    this.userService.findAll(page, size).pipe(
      map((userData: UserData) => this.dataSource = userData)
    ).subscribe();
  }

  navigateToUpdate(id) {
    this.router.navigate(['./' + id], {relativeTo: this.activatedRoute});
  }

  delete(id){
    this.userService.deleteOne(id).subscribe();
    window.location.reload();
    // this.ngOnInit();
  }

}
