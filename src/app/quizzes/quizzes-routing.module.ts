import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { QuizzesComponent } from './quizzes.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { UsersResolver } from '../_core/resolvers/users-resolver.service';
import { QuizDetailsComponent } from './quiz-details/quiz-details.component';

const routes: Routes = [
  { path: '', component: QuizzesComponent, resolve: {users: UsersResolver} },
  { path: 'nieuw', component: CreateQuizComponent, resolve: {users: UsersResolver}},
  { path: ':id', component: QuizDetailsComponent }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class QuizzesRoutingModule { }
