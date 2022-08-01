import { Injectable, OnDestroy } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, onSnapshot, orderBy, query, where } from '@angular/fire/firestore';
import { BehaviorSubject, filter, map, Observable, Subscription } from 'rxjs';
import { SpinnerService } from '../_core/services/spinner.service';
import { IQuiz } from '../_shared/models/quiz';
import { ISeason } from '../_shared/models/season';
import {parse} from 'node-html-parser';

@Injectable({
  providedIn: 'root'
})
export class QuizService implements OnDestroy {
  private quizzesSub: Subscription | undefined;
  private quizzesBySeasonSub: Subscription | undefined;
  private quizzesSource = new BehaviorSubject<IQuiz[] | null>(null);

  private quizzesBySeasonSource = new BehaviorSubject<IQuiz[]>([]);
  quizzesBySeason$ = this.quizzesBySeasonSource.asObservable();

  constructor(private firestore: Firestore, private spinnerService: SpinnerService) { }

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

  async getSiteInfo(url: string) {
    const response = await fetch(`https://api.codetabs.com/v1/proxy?quest=${url}`);
    const text = await response.text();
    const terms = parse(text);
    const tds = terms.querySelectorAll('td');

    const quizData: any = {};

    for(const [index, td] of tds.entries()) {
      switch(td.innerText) {
        case 'Zaal':
          quizData.address = tds[index+1].innerText;
          break;
        case 'Straat+nr':
          quizData.address += ', ' +  tds[index+1].innerText;
          break;
        case 'Plaats':
          quizData.zipcode = parseInt(tds[index+1].innerText.split(' - ')[0]);
          quizData.city = tds[index+1].innerText.split(' - ')[1];
          break;
        case 'Aantal personen/ploeg':
          quizData.numberOfPlayers = tds[index+1].innerText;
          break;
        case 'Datum - Aanvang':
          const text = tds[index+3].innerText.split(', ')[1].split(' - ');
          const date = text[0].split('/').map(x => parseInt(x));
          const time = text[1].split(':').map(x => parseInt(x));
          quizData.date = new Date(date[2], date[1] - 1, date[0], time[0], time[1]);
          break;
        case 'Naam Quiz':
          quizData.name = tds[index+3].innerText;
          break;
      }
    }
    return quizData;
  }


  private getQuizzesFromDb()  {
    if(!this.quizzesSub || this.quizzesSub.closed) {
      this.spinnerService.start();
      const ref = collection(this.firestore, 'quizzes');
      const q = query(ref, orderBy('date','desc'));
      this.quizzesSub = collectionData(q, {idField: 'id'}).subscribe({
        next: data => {
          this.spinnerService.stop();
          this.quizzesSource.next(data as IQuiz[]);
        },
        error: error => console.log(error)
      })
    }
  }

  ngOnDestroy(): void {
    this.quizzesSub?.unsubscribe();
  }
}
