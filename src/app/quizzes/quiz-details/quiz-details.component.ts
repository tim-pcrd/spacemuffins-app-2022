import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, debounceTime, filter, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { CityService } from 'src/app/_core/services/city.service';
import { UserService } from 'src/app/_core/services/user.service';
import { ICity } from 'src/app/_shared/models/city';
import { IQuiz } from 'src/app/_shared/models/quiz';
import { IUser } from 'src/app/_shared/models/user';
import { QuizService } from '../quiz.service';
import * as _ from 'lodash';
import { QuizFormService } from '../quiz-form.service';

@Component({
  selector: 'app-quiz-details',
  templateUrl: './quiz-details.component.html',
  styleUrls: ['./quiz-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class QuizDetailsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  data$: Observable<{quiz: IQuiz | undefined, currentUser: IUser}> | undefined;
  //TODO betere oplossing
  // cityList$: Observable<ICity[]> | undefined;
  defaultTime = [20,0,0];
  cityList: ICity[] = [];
  showSpinner = false;
  corePlayers: IUser[] = [];
  regularPlayers: IUser[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA];
  editMode = true;
  menuOpen = false;
  private users: IUser[] = [];

  quizForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    date: ['', Validators.required],
    address: ['', Validators.required],
    zipcode: ['', Validators.required],
    city: ['', Validators.required],
    numberOfPlayers: ['', Validators.required],
    corePlayers: this.fb.array([]),
    regularPlayers: [[]],
    guests: [[]],
    remarks: ['']
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private quizService: QuizService,
    private cityService: CityService,
    private userService: UserService,
    private route: ActivatedRoute,
    private quizFormService: QuizFormService) { }


  ngOnInit(): void {

    //TODO checken of switchmap hier werkt
    this.data$ = this.route.paramMap.pipe(
      switchMap(params => {
        const quizId = params.get('id')!;
        return combineLatest({
          quiz: this.quizService.getQuizById(quizId),
          currentUser: this.authService.currentUser$,
          users: this.userService.getAllUsers()
        })
      }),
      map(data => {
        this.users = data.users;
        [this.corePlayers, this.regularPlayers] = this.quizFormService.getCoreAndRegularPlayers(data.currentUser, this.users);
        this.addCheckboxes(data.quiz?.players);
        this.quizForm.patchValue({
          ...data.quiz,
          date: data.quiz?.date.toDate(),
          regularPlayers: this.getRegularPlayers(data.quiz?.players)
        });
        console.log(this.quizForm.value);
        return {quiz: data.quiz, currentUser: data.currentUser}
      })
    )

    this.getCityList();
  }

  get corePlayersFormArray(): FormArray {
    return this.quizForm.get('corePlayers') as FormArray;
  }

  removeGuest(guest: string) {
    const index = this.guests?.value.indexOf(guest);
    if(index >= 0 ) {
      this.guests?.value.splice(index, 1);
    }
  }

  addGuest(event: MatChipInputEvent) {
    const value = event.value;
    if(value) {
      this.quizForm.patchValue({guests: [...this.guests?.value, value]})
    }
    event.chipInput?.clear();
  }

  save() {

  }

  doAction(data:string) {
    if(data === 'trigger') {
      this.menuOpen = !this.menuOpen;
      console.log('trigger')
    }
  }

  private addCheckboxes(players: {[key:string]: boolean} | undefined) {
    for(const player of this.corePlayers) {
      if(players && Object.keys(players).includes(player.id!)) {
        this.corePlayersFormArray.push(new FormControl(players[player.id!]));
      } else {
        this.corePlayersFormArray.push(new FormControl(null));
      }
    }
  }

  private getRegularPlayers(players: {[key:string]: boolean} | undefined) {
    const regulars = [];
    for(const player of this.regularPlayers) {
      if(players && Object.keys(players).includes(player.id!)) {
        regulars.push(player.id);
      }
    }
    return regulars;
  }


  private get guests() {
    return this.quizForm.get('guests');
  }

  private getCityList() {
    const zipcodeControl = this.quizForm.get('zipcode');
    zipcodeControl?.valueChanges
      .pipe(
        tap(() => this.showSpinner = true),
        debounceTime(1000),
        tap(zipcode => {
          this.cityList = [];
          if (zipcode < 1000 || zipcode > 9999) {
            this.showSpinner = false;
          }
        }),
        filter(zipcode => zipcode >= 1000 && zipcode <= 9999),
        switchMap(zipcode => {
          return this.cityService.getCitiesFromZipcode(zipcode)
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(cities => {
        this.cityList = cities;
        this.showSpinner = false;
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
