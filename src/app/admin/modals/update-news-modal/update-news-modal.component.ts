import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiRoutes, apiUrl } from 'src/app/config/network.config';
import { INews, INewsTag } from 'src/app/types/news.types';
import { NewsService } from 'src/app/services/news.service';

interface DialogData {
  item: INews,
  tags: INewsTag[]
}

@Component({
  selector: 'app-update-news-modal',
  templateUrl: './update-news-modal.component.html',
  styleUrls: ['./update-news-modal.component.scss']
})
export class UpdateNewsModalComponent {
  public api = apiUrl
  public form;
  public tags: INewsTag[] = []

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateNewsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private http: HttpClient,
  ) {    
    const { item, tags } = data;
    this.tags = tags
    this.form = this.fb.group({
      title: [item.title, Validators.required],
      text: [item.text.join('\n'), Validators.required],
      photo: [item.photo, Validators.required],
      tags: [item.tags.map(t => t.id)],
    });
  }

  ngOnInit(): void {

    this.form.valueChanges.subscribe(() => {
      // console.log(res);
    });
  }

  public onAddImage(e: Event) {
    const files = (e.target as HTMLInputElement).files

    const file = files && files[0];

    const formData = new FormData();
    if (file) {
      formData.append('path', 'posters');
      formData.append('file', file);
    } else {
      console.warn('No file.');
      return;
    }
   
    this.http.post<{ filename: string, secureUrl: string }>(`${ApiRoutes.upload}`, formData)
      .subscribe(res => {
        this.form.controls['photo'].setValue(res.secureUrl)
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
    
    const tags = this.form.value.tags

    this.http.patch<{ updated: INews }>(`${ApiRoutes.news}/${this.data.item.id}`, {
      update: {
        ...this.form.value,
        tags,
      }
    })
      .subscribe({
        next: res => {
          this.dialogRef.close({ result: 'success', item: res.updated })
        },
        error: err => {
          console.error(err);
        }
      })
  }
}
