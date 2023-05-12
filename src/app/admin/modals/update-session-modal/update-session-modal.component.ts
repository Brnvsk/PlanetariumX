import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiRoutes } from 'src/app/config/network.config';
import { IShow, IShowSession } from 'src/app/types/show.types';
import { CreateShowModalComponent } from '../create-show-modal/create-show-modal.component';

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
  public form;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateShowModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private http: HttpClient,
  ) {
    const { session, shows } = data;
    console.log('update session modal shows:', shows);
    
    this.form = this.fb.group({
      showId: [session.showId, Validators.required],
      date: [session.date, Validators.required],
      time: [session.time, Validators.required],
      address: [session.address, Validators.required],
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe((res) => {
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

    this.http.patch<{ updated: IShowSession }>(`${ApiRoutes.sessions}/${this.data.session.id}`, {
      update: this.form.value
    })
      .subscribe({
        next: res => {
          this.dialogRef.close({ result: 'success', show: res.updated })
        },
        error: err => {
          console.error(err);
        }
      })
  }
}
