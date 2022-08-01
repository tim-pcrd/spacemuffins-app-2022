import { Injectable, OnDestroy } from '@angular/core';
import {collectionData, Firestore, collection, addDoc} from '@angular/fire/firestore';
import { BehaviorSubject, filter, Observable, Subscription } from 'rxjs';
import { IUser } from '../../_shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {

  private usersSub: Subscription | undefined;
  private usersSource = new BehaviorSubject<IUser[] | null>(null);

  constructor(private firestore: Firestore) { }


  getAllUsers(): Observable<IUser[]> {
    if (this.usersSource.value == null) {
      this.getAllUsersFromDb();
    }
    return this.usersSource.asObservable().pipe(filter(users => !!users)) as Observable<IUser[]>;
  }

  addUser(user: IUser) {
    const usersCollection = collection(this.firestore, 'users');
    addDoc(usersCollection, user)
      .then(() => console.log('success'))
      .catch((err) => console.log(err));
  }

  private getAllUsersFromDb() {
    if (!this.usersSub || this.usersSub.closed) {
      const usersCollection = collection(this.firestore, 'users');
      this.usersSub = collectionData(usersCollection, {idField: 'id'})
        .subscribe(data => {
          console.log(data);
          this.usersSource.next(data as IUser[]);
        }, error => console.log(error));
    }
  }

  ngOnDestroy(): void {
    this.usersSub?.unsubscribe();
  }

}
