import { Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { BehaviorSubject, filter, Observable, Subscription } from 'rxjs';
import { ISeason } from 'src/app/_shared/models/season';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {

  private seasonsSub: Subscription | undefined;
  private seasonsSource = new BehaviorSubject<ISeason[] | null>(null);

  constructor(private firestore: Firestore) { }

  getAllSeasons(): Observable<ISeason[]> {
    if (this.seasonsSource.value == null) {
      this.getAllSeasonsFromDb();
    }
    return this.seasonsSource.asObservable().pipe(filter(seasons => !!seasons)) as Observable<ISeason[]>;
  }


  private getAllSeasonsFromDb() {
    if (!this.seasonsSub || this.seasonsSub.closed) {
      const seasonsCollection = collection(this.firestore, 'seasons');
      this.seasonsSub = collectionData(seasonsCollection, {idField: 'id'})
        .subscribe(data => {
          console.log(data);
          this.seasonsSource.next(data as ISeason[]);
        }, error => console.log(error));
    }
  }

  ngOnDestroy(): void {
    this.seasonsSub?.unsubscribe();
  }
}
