import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { TriStateCheckboxComponent } from './components/tri-state-checkbox/tri-state-checkbox.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import { DateTodayComponent } from './components/date-today/date-today.component';

@NgModule({
  declarations: [
    TriStateCheckboxComponent,
    DateTodayComponent
  ],
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    TriStateCheckboxComponent,
    MatCardModule,
    DateTodayComponent
  ]
})
export class SharedModule { }
