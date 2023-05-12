import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiRoutes } from 'src/app/config/network.config';
import { IShow, IShowSession } from 'src/app/types/show.types';
import { CreateShowModalComponent } from '../create-show-modal/create-show-modal.component';

interface DialogData {
  shows: IShow[]
}

const sessionsTime = ['10:00', '10:30', '11:00', '11:30', '12:00']

@Component({
  selector: 'app-create-session-modal',
  templateUrl: './create-session-modal.component.html',
  styleUrls: ['./create-session-modal.component.scss']
})
export class CreateSessionModalComponent {
  public form;
  public shows: IShow[];
  public timeslots = sessionsTime
  public messageText: string | null = null

  public get today() {
    return new Date()
  }

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<CreateShowModalComponent>,
    private http: HttpClient,
  ) {
    const { shows } = data
    this.shows = shows
    console.log(shows);
    
    this.form = this.fb.group({
      showId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe((res) => {
      this.messageText = null
      // console.log(res);
    });
  }

  public cancel() {
    this.dialogRef.close({
      result: 'cancel',
    });
  }

  public submit() {
    if (this.form.invalid) {
      return;
    }

    this.http.post<{ created: IShowSession }>(`${ApiRoutes.sessions}`, this.form.value)
      .subscribe({
        next: res => {
          this.dialogRef.close({ result: 'success', session: res.created })
        },
        error: err => {
          console.error(err);
          const { message } = err.error;
          this.messageText = message ?? 'Ошибка'
        }
      })
  }
}
