import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { IUser } from '../_shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor() { }

  loginUser() {
    this.currentUserSource.next({
      name: 'Tim',
      roles: ['admin', 'core'],
      id: '8EIU4VF21g9dYGF9X9Nd'
    });
  }


}
