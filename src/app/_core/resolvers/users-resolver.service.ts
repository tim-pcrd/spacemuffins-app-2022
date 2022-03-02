import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, take } from 'rxjs';
import { IUser } from 'src/app/_shared/models/user';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class UsersResolver implements Resolve<IUser[]> {

  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUser[]> | Promise<IUser[]> | IUser[] {
    return this.userService.getAllUsers().pipe(take(1));
  }
}
