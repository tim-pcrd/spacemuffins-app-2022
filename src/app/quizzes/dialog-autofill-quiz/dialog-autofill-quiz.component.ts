import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-autofill-quiz',
  templateUrl: './dialog-autofill-quiz.component.html',
  styleUrls: ['./dialog-autofill-quiz.component.scss']
})
export class DialogAutofillQuizComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogAutofillQuizComponent>, @Inject(MAT_DIALOG_DATA) public url: string) { }

  ngOnInit(): void {
  }

}
