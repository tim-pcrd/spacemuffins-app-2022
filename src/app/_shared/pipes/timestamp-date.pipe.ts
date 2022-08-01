import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import * as moment from 'moment';
moment.locale('nl-be')

@Pipe({
  name: 'timestampDate'
})

export class TimestampDatePipe implements PipeTransform {
  transform(value: Timestamp, format: string ,...args: any[]): any {
    return moment(value.toDate()).format(format);
  }
}
