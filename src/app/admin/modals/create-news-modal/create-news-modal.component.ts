import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiRoutes } from 'src/app/config/network.config';
import { INews, INewsTag } from 'src/app/types/news.types';
import { NewsService } from 'src/app/services/news.service';

interface DialogData {
  tags: INewsTag[]
}


@Component({
  selector: 'app-create-news-modal',
  templateUrl: './create-news-modal.component.html',
  styleUrls: ['./create-news-modal.component.scss']
})
export class CreateNewsModalComponent {
  public form;

  public tags: INewsTag[]

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateNewsModalComponent>,
    private newsService: NewsService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private http: HttpClient,
  ) {
    this.tags = data.tags
    this.form = this.fb.group({
      title: ['', Validators.required],
      text: ['', Validators.required],
      photo: ['', Validators.required],
      tags: [['']]
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe((res) => {
      // console.log(res);
    });
  }

  public onAddImage(e: Event) {
    const files = (e.target as HTMLInputElement).files

    const file = files && files[0];

    const formData = new FormData();
    if (file) {
      formData.append('path', 'news');
      formData.append('file', file);
    } else {
      console.warn('No file.');
      return;
    }
   
    this.http.post<{ filename: string }>(`${ApiRoutes.upload}`, formData)
      .subscribe(res => {
        this.form.controls.photo.setValue(res.filename)
      })
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

    const { title, text, photo, tags } = this.form.value

    this.http.post<{ created: INews }>(`${ApiRoutes.news}`, {
      title, text, photo,
      tags: tags?.join('-')
    })
      .subscribe({
        next: res => {
          const item = {
            ...res.created,
            tags: tags?.map(tagId => this.tags.find(tag => tag.id === Number(tagId)))
          }
          this.dialogRef.close({ result: 'success', news: item })
        },
        error: err => {
          console.error(err);
        }
      })
  }
}
