import { Injectable, OnDestroy } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, onSnapshot, orderBy, query, where } from '@angular/fire/firestore';
import { BehaviorSubject, filter, map, Observable, Subscription } from 'rxjs';
import { IQuiz } from '../_shared/models/quiz';
import { ISeason } from '../_shared/models/season';

@Injectable({
  providedIn: 'root'
})
export class QuizService implements OnDestroy {
  private quizzesSub: Subscription | undefined;
  private quizzesBySeasonSub: Subscription | undefined;
  private quizzesSource = new BehaviorSubject<IQuiz[] | null>(null);

  private quizzesBySeasonSource = new BehaviorSubject<IQuiz[]>([]);
  quizzesBySeason$ = this.quizzesBySeasonSource.asObservable();

  constructor(private firestore: Firestore) { }

  getQuizzes(): Observable<IQuiz[]> {
    if(this.quizzesSource.value === null) {
      this.getQuizzesFromDb();
    }
    return this.quizzesSource.asObservable().pipe(filter(quizzes => !!quizzes)) as Observable<IQuiz[]>;
  }

  getQuizzesBySeason(season: ISeason) {
    this.quizzesBySeasonSub?.unsubscribe();

    this.quizzesBySeasonSub = this.getQuizzes().pipe(
      map(quizzes => quizzes.filter(x => x.date >= season.beginDate && x.date < season.endDate))
    )
    .subscribe(quizzes => {
      console.log(quizzes);
      this.quizzesBySeasonSource.next(quizzes);
    })

  }

  UnsubscribeQuizzesBySeason() {
    this.quizzesBySeasonSub?.unsubscribe();
  }

  getQuizById(id: string): Observable<IQuiz | undefined> {
    return this.getQuizzes().pipe(
      map(quizzes => quizzes.find(x => x.id === id))
    )
  }

  createQuiz(quiz: IQuiz) {
    const quizzesCollection = collection(this.firestore, 'quizzes');
    addDoc(quizzesCollection, quiz)
      .then(x => console.log(x))
      .catch(error => console.log(error));
  }

  private getQuizzesFromDb()  {
    if(!this.quizzesSub || this.quizzesSub.closed) {
      const ref = collection(this.firestore, 'quizzes');
      const q = query(ref, orderBy('date','desc'));
      this.quizzesSub = collectionData(q, {idField:'id'}).subscribe(data => {
        // for(const quiz of data) {
        //   quiz['date'] = quiz['date'].toDate();
        // }
        console.log(data);
        this.quizzesSource.next(data as IQuiz[]);
      })
    }
  }

  ngOnDestroy(): void {
    this.quizzesSub?.unsubscribe();
  }
}
