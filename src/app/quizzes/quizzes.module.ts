import { NgModule } from '@angular/core';
import { QuizzesComponent } from './quizzes.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { SharedModule } from '../_shared/shared.module';
import { QuizzesRoutingModule } from './quizzes-routing.module';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { QuizPlayersComponent } from './quiz-players/quiz-players.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatTableModule} from '@angular/material/table';
import { QuizDetailsComponent } from './quiz-details/quiz-details.component';
import { DialogAutofillQuizComponent } from './dialog-autofill-quiz/dialog-autofill-quiz.component';



@NgModule({
  declarations: [
    QuizzesComponent,
    CreateQuizComponent,
    QuizPlayersComponent,
    QuizDetailsComponent,
    DialogAutofillQuizComponent
  ],
  imports: [
    SharedModule,
    QuizzesRoutingModule,
    MatDatepickerModule,
    NgxMatDatetimePickerModule,
    MatChipsModule,
    MatTableModule
  ]
})
export class QuizzesModule { }
