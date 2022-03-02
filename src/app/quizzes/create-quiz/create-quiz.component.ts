import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, combineLatest, takeUntil, debounceTime, tap, filter, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { CityService } from 'src/app/_core/services/city.service';
import { ICity } from 'src/app/_shared/models/city';
import { IUser } from 'src/app/_shared/models/user';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import * as _ from 'lodash';
import * as moment from 'moment';
import { MatChipInputEvent } from '@angular/material/chips';
import { QuizService } from '../quiz.service';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.scss']
})
export class CreateQuizComponent implements OnInit {
  private readonly destroy$ = new Subject<void>();
  readonly separatorKeysCodes = [ENTER, COMMA]
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
    return this.quizForm.get('corePlayers') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private cityService: CityService,
    private quizService: QuizService) {
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
      this.setCoreAndRegularPlayers();
      this.addCheckboxes();
      this.isLoading = false
    });

    this.getCityList();
  }

  save() {
    if(!this.quizForm.valid) {
      return;
    }

    let _quiz = {
      ...this.quizForm.value,
      players: this.getPlayers(),
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
  }

  private setCoreAndRegularPlayers() {
    this.corePlayers =  _.sortBy(this.users.filter(x => x.roles.includes('core') && x.id !== this.currentUser.id), x => x.name);
    this.regularPlayers = _.sortBy(this.users.filter(x => x.roles.includes('regular')), x => x.name);

    if(this.currentUser.roles.includes('core')) {
      this.corePlayers.unshift(this.currentUser);
    }
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


  // put core and regular players in same object
  private getPlayers() {
    let players: {[key:string]: boolean} = {};

    for(const [index, value] of this.quizForm.get('corePlayers')?.value.entries()) {
      if(value != null) {
        players[this.corePlayers[index].id!] = value;
      }
    }

    for(const playerId of this.quizForm.get('regularPlayers')?.value) {
      players[playerId] = true;
    }

    return players;
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
