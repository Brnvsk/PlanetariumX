import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiRoutes } from 'src/app/config/network.config';
import { IShow, IShowSession } from 'src/app/types/show.types';
import { sessionsTime } from '../../config/admin.config';

interface DialogData {
  session: IShowSession,
  shows: IShow[]
}

@Component({
  selector: 'app-update-session-modal',
  templateUrl: './update-session-modal.component.html',
  styleUrls: ['./update-session-modal.component.scss']
})
export class UpdateSessionModalComponent {
  public session: IShowSession;
  
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
    private dialogRef: MatDialogRef<UpdateSessionModalComponent>,
    private http: HttpClient,
  ) {
    const { shows, session } = data
    this.session = session
    this.shows = shows
    
    this.form = this.fb.group({
      date: [session.date, Validators.required],
      time: [session.time, Validators.required],
      address: [session.address, Validators.required],
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

    this.http.patch<{ updated: IShowSession }>(`${ApiRoutes.sessions}/${this.session.id}`, {
      update: this.form.value
    })
      .subscribe({
        next: res => {
          this.dialogRef.close({ result: 'success', session: res.updated })
        },
        error: err => {
          console.error(err);
          const { message } = err.error;
          this.messageText = message ?? 'Ошибка'
        }
      })
  }
}
