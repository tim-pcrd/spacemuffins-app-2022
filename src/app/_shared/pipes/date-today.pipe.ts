import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from 'firebase/firestore';

@Pipe({
  name: 'dateToday'
})

export class DateTodayPipe implements PipeTransform {
  transform(value: Timestamp, ...args: any[]): any {
    const date = value.toDate();
  }
}
