import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { Page } from './interface/page';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  usersState$: Observable<{
    appState: string;
    appData?: Page;
    error?: HttpErrorResponse;
  }>;
  responseSubject = new BehaviorSubject<Page>(null);
  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.usersState$ = this.userService.users$().pipe(
      map((response: Page) => {
        this.responseSubject.next(response);
        this.currentPageSubject.next(response.number)
        console.log(response);
        return { appState: 'APP_LOADED', appData: response };
      }),
      startWith({ appState: 'APP_LOADING' }),
      catchError((error: HttpErrorResponse) =>
        of({ appState: 'APP_ERROR', error })
      )
    );
  }

  goToPage(name?: string, pageNumber: number = 0): void {
    console.log(name);
    
    this.usersState$ = this.userService.users$(name, pageNumber).pipe(
      map((response: Page) => {
        this.responseSubject.next(response);
        this.currentPageSubject.next(pageNumber)
        console.log(response);
        return { appState: 'APP_LOADED', appData: response };
      }),
      startWith({
        appState: 'APP_LOADED',
        appData: this.responseSubject.value,
      }),
      catchError((error: HttpErrorResponse) =>
        of({ appState: 'APP_ERROR', error })
      )
    );
  }

  goToNextOrPreviousPage(direction?: string, name?: string): void {
    this.goToPage(
      name,
      direction === 'forward'
        ? this.currentPageSubject.value + 1
        : this.currentPageSubject.value - 1
    );
  }
}
