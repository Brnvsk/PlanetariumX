import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiRoutes } from 'src/app/config/network.config';
import { DialogData } from 'src/app/main-page/games/components/solar-system/solar-system.component';

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
      title: '',
      descr: '',
      price: '',
      poster: '',
      file: new File([], '')
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe((res) => {
      console.log(res);
    });
  }

  public onAddImage(e: Event) {
    const files = (e.target as HTMLInputElement).files
    if (files && files.length > 0) {
      const file = files[0];
      this.form.patchValue({
        file,
      });
    }

    const formData = new FormData();
    const fileValue = this.form.controls.file.value
    if (fileValue) {
      formData.append('path', 'posters');
      formData.append('file', fileValue);
    }
   
    this.http.post(`${ApiRoutes.upload}`, formData)
      .subscribe(res => {
        console.log(res);
      })
  }

  public cancel() {
    this.dialogRef.close('cancel');
  }

  public submit() {}
}
