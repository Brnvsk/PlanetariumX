import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiRoutes } from 'src/app/config/network.config';
import { INews, INewsTag } from 'src/app/types/news.types';
import { UpdateNewsModalComponent } from '../update-news-modal/update-news-modal.component';

interface DialogData {
  tag: INewsTag,
}

@Component({
  selector: 'app-update-tag-modal',
  templateUrl: './update-tag-modal.component.html',
  styleUrls: ['./update-tag-modal.component.scss']
})
export class UpdateTagModalComponent {
  public form;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateNewsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private http: HttpClient,
  ) {    
    const { tag } = data;
    this.form = this.fb.group({
      name: [tag.name, Validators.required],
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
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
    
    this.http.patch<{ updated: INewsTag }>(`${ApiRoutes.news.tags}/${this.data.tag.id}`, {
      update: {
        name: this.form.value.name,
      }
    })
      .subscribe({
        next: res => {
          this.dialogRef.close({ result: 'success', item: res.updated })
        },
        error: err => {
          console.error('Err update tag', err);
        }
      })
  }
}
