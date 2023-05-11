import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiRoutes } from 'src/app/config/network.config';
import { DialogData } from 'src/app/main-page/games/components/solar-system/solar-system.component';
import { IShow } from 'src/app/types/show.types';

@Component({
  selector: 'app-create-show-modal',
  templateUrl: './create-show-modal.component.html',
  styleUrls: ['./create-show-modal.component.scss'],
})
export class CreateShowModalComponent implements OnInit {
  public form;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateShowModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private http: HttpClient,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      descr: ['', Validators.required],
      price: ['', Validators.required],
      // add multiselect for tags
      posterPath: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe((res) => {
      console.log(res);
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

    this.http.post<{ created: IShow }>(`${ApiRoutes.shows}`, this.form.value)
      .subscribe({
        next: res => {
          this.dialogRef.close({ result: 'success', show: res.created })
        },
        error: err => {
          console.error(err);
        }
      })
  }
}
