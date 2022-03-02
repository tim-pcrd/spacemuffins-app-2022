import { NgModule } from '@angular/core';
import { QuizzesComponent } from './quizzes.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { EditQuizComponent } from './edit-quiz/edit-quiz.component';
import { SharedModule } from '../_shared/shared.module';
import { QuizzesRoutingModule } from './quizzes-routing.module';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { QuizPlayersComponent } from './quiz-players/quiz-players.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatTableModule} from '@angular/material/table';



@NgModule({
  declarations: [
    QuizzesComponent,
    CreateQuizComponent,
    EditQuizComponent,
    QuizPlayersComponent
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
