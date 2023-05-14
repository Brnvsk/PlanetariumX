import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiRoutes } from 'src/app/config/network.config';
import { IShow } from 'src/app/types/show.types';

interface DialogData {
  show: IShow
}

@Component({
  selector: 'app-update-show-modal',
  templateUrl: './update-show-modal.component.html',
  styleUrls: ['./update-show-modal.component.scss']
})
export class UpdateShowModalComponent {
  public form;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateShowModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private http: HttpClient,
  ) {
    const { show } = data;
    this.form = this.fb.group({
      title: [show.title, Validators.required],
      descr: [show.descr, Validators.required],
      price: [show.price, Validators.required],
      posterPath: [show.poster_src, Validators.required],
      director: [''],
      country: [''],
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
      formData.append('path', 'posters');
      formData.append('file', file);
    } else {
      console.warn('No file.');
      return;
    }
   
    this.http.post<{ filename: string }>(`${ApiRoutes.upload}`, formData)
      .subscribe(res => {
        this.form.controls.posterPath.setValue(res.filename)
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

    this.http.patch<{ updated: IShow }>(`${ApiRoutes.shows}/${this.data.show.id}`, {
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
