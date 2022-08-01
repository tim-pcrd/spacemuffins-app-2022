import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { SeasonService } from '../_core/services/season.service';
import { IDisplayQuiz, IQuiz } from '../_shared/models/quiz';
import { ISeason } from '../_shared/models/season';
import { IUser } from '../_shared/models/user';
import { QuizService } from './quiz.service';
import * as _ from 'lodash';
import { AuthService } from '../auth/auth.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class QuizzesComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  seasons$: Observable<ISeason[]> | undefined;
  quizzes$: Observable<IDisplayQuiz[]> | undefined;
  columnsToDisplay = ['date','hour', 'name', 'city'];
  expandedElement: IQuiz | null = null;
  currentUser$: Observable<IUser> | undefined;

  selectedSeason = new FormControl();
  dateNow = Date.now() / 1000;

  constructor(
    private quizService: QuizService,
    private seasonService: SeasonService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {
      this.matIconRegistry.addSvgIcon('gmaps',this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/google-maps-icon.svg'));
      this.matIconRegistry.addSvgIcon('gcalendar', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/google-calendar-icon.svg'));
    }


  ngOnInit(): void {
    this.route.data.subscribe(data => {
      const users = data['users'];
      this.setSubscriptions(users);
    })

    this.selectedSeason.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(season => this.quizService.getQuizzesBySeason(season));
  }


  setSubscriptions(users : IUser[]) {
    this.seasons$ = this.seasonService.getAllSeasons().pipe(
      tap(seasons => this.selectedSeason.setValue(
         seasons.find(x => x.beginDate.toDate() <= new Date() && x.endDate.toDate() >= new Date()))
      ));

    this.quizzes$ = this.quizService.quizzesBySeason$.pipe(
      map(quizzes => {
        return this.getPlayersPresence(quizzes, users);
      })
    );

    this.currentUser$ = this.authService.currentUser$
  }


  getPlayersPresence(quizzes: IQuiz[], users: IUser[]): IDisplayQuiz[] {
    const _quizzes: IDisplayQuiz[] = [];
    for(const quiz of quizzes) {
      let _quiz: IDisplayQuiz = {...quiz} as IDisplayQuiz;
      _quiz.corePlayersPresent = [];
      _quiz.corePlayersAbsent = [];
      _quiz.regularPlayersPresent = [];
      if(quiz.players) {
        for (const [userId, present] of Object.entries(quiz.players)) {
          const user = users.find(x => x.id === userId);
          if(user?.roles.includes('core') && present) {
            _quiz.corePlayersPresent.push(user);
          } else if(user?.roles.includes('core') && !present) {
            _quiz.corePlayersAbsent.push(user);
          } else if(user?.roles.includes('regular')) {
            _quiz.regularPlayersPresent.push(user);
          }
        }
      }
      _quiz.corePlayersPresent = _.sortBy(_quiz.corePlayersPresent, x => x.name);
      _quiz.corePlayersAbsent = _.sortBy(_quiz.corePlayersAbsent, x => x.name);
      _quiz.regularPlayersPresent = _.sortBy(_quiz.regularPlayersPresent, x => x.name);
      _quizzes.push(_quiz);
    }
    return _quizzes;
  }


  ngOnDestroy(): void {
    this.quizService.UnsubscribeQuizzesBySeason();
    this.destroy$.next();
    this.destroy$.complete();
  }

}
