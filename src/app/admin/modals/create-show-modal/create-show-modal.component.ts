import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiRoutes, apiUrl } from 'src/app/config/network.config';
import { IShow } from 'src/app/types/show.types';


@Component({
  selector: 'app-create-show-modal',
  templateUrl: './create-show-modal.component.html',
  styleUrls: ['./create-show-modal.component.scss'],
})
export class CreateShowModalComponent implements OnInit {
  public api = apiUrl
  public form;
  public posterTouched = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateShowModalComponent>,
    private http: HttpClient,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      descr: ['', Validators.required],
      price: ['', Validators.required],
      posterPath: ['', Validators.required],
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
    this.http.post<{ filename?: string, secureUrl: string }>(`${ApiRoutes.upload}`, formData)
      .subscribe(res => {
        this.form.controls.posterPath.setValue(res.secureUrl)
        this.posterTouched = true;
      })
  }

  public cancel() {
    this.dialogRef.close({
      result: 'cancel',
    });
  }

  public submit() {
    this.posterTouched = true;
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
