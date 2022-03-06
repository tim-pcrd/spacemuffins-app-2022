import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import * as moment from 'moment';
moment.locale('nl-be')

@Component({
  selector: 'app-date-today',
  templateUrl: './date-today.component.html',
  styleUrls: ['./date-today.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTodayComponent implements OnInit {
  @Input() timestamp: Timestamp | undefined;
  result: string = '';

  constructor() { }

  ngOnInit(): void {
    const date = this.timestamp?.toDate();
    if(date && this.dateIsToday(date)) {
      this.result = 'Vandaag';
    } else if(date){
      this.result = moment(date).format('L dd');
    }
  }

  dateIsToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }

}
