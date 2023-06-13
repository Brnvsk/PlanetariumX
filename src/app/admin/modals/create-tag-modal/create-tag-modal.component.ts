import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiRoutes } from 'src/app/config/network.config';
import { INewsTag } from 'src/app/types/news.types';
import { CreateShowModalComponent } from '../create-show-modal/create-show-modal.component';

@Component({
  selector: 'app-create-tag-modal',
  templateUrl: './create-tag-modal.component.html',
  styleUrls: ['./create-tag-modal.component.scss']
})
export class CreateTagModalComponent {
  public form;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateTagModalComponent>,
    private http: HttpClient,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
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

    this.http.post<{ created: INewsTag }>(`${ApiRoutes.news.tags}`, this.form.value)
      .subscribe({
        next: res => {
          this.dialogRef.close({ result: 'success', tag: res.created })
        },
        error: err => {
          console.error(err);
        }
      })
  }
}
