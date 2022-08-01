import { ChangeDetectionStrategy, Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, combineLatest, takeUntil, debounceTime, tap, filter, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { CityService } from 'src/app/_core/services/city.service';
import { ICity } from 'src/app/_shared/models/city';
import { IUser } from 'src/app/_shared/models/user';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import * as _ from 'lodash';
import * as moment from 'moment'
import { MatChipInputEvent } from '@angular/material/chips';
import { QuizService } from '../quiz.service';
import { QuizFormService } from '../quiz-form.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogAutofillQuizComponent } from '../dialog-autofill-quiz/dialog-autofill-quiz.component';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.scss']
})
export class CreateQuizComponent implements OnInit {
  private readonly destroy$ = new Subject<void>();
  readonly separatorKeysCodes = [ENTER, COMMA];
  currentUser!: IUser;
  private users: IUser[] = [];
  cityList: ICity[] = [];
  corePlayers: IUser[] = [];
  regularPlayers: IUser[] = [];
  isCollapsed = false;
  touchUi = true;
  defaultTime = [20,0,0];
  showSpinner = false;
  isLoading = true;

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


  get corePlayersFormArray(): FormArray {
    //TODO change getter
    return this.quizForm.get('corePlayers') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private cityService: CityService,
    private quizService: QuizService,
    private quizFormService: QuizFormService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    combineLatest([
      this.authService.currentUser$,
      this.route.data
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe(([currentUser, data]) => {
      this.currentUser = currentUser;
      this.users = data['users'];
      console.log('hello');
      // this.setCoreAndRegularPlayers();
      [this.corePlayers, this.regularPlayers] = this.quizFormService.getCoreAndRegularPlayers(this.currentUser, this.users);
      this.addCheckboxes();
      this.isLoading = false
    });

    this.getCityList();
    this.quizService.getSiteInfo('http://www.bqb.be/aankondiging?A_ID=7346');
  }

  save() {
    console.log(this.quizForm.value);
    if(!this.quizForm.valid) {
      return;
    }

    let _quiz = {
      ...this.quizForm.value,
      players: this.quizFormService.getMergedPlayers(this.corePlayers, this.quizForm),
      date: this.getDate()
    };

    const {corePlayers, regularPlayers, ...quizToSave} = _quiz;

    this.quizService.createQuiz(quizToSave);
  }

  private get guests() {
    return this.quizForm.get('guests');
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
    event.chipInput?.clear();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAutofillQuizComponent, {
      width: '300px',
      data: '',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.quizService.getSiteInfo(result)
        .then(quiz => {
          console.log(quiz);
          this.quizForm.patchValue(quiz)
        })
        .catch(error => console.log(error));
    })
  }


  private addCheckboxes() {
    for(const player of this.corePlayers) {
      this.corePlayersFormArray.push(new FormControl(null));
    }
  }

  private getCityList() {
    const zipcodeControl = this.quizForm.get('zipcode');
    zipcodeControl?.valueChanges
      .pipe(
        tap(() => this.showSpinner = true),
        debounceTime(800),
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


  // get date from moment object
  private getDate() {
    return this.quizForm.get('date')?.value.toDate();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
