import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';
import { UpdateSessionModalComponent } from 'src/app/admin/modals/update-session-modal/update-session-modal.component';
import { NewsService } from 'src/app/services/news.service';
import { INewsTag } from 'src/app/types/news.types';

interface DialogData {
  userTags: INewsTag[],
}

interface TagItem {
  id: number,
  name: string,
  checked: boolean,
}

@Component({
  selector: 'app-edit-news-tags-modal',
  templateUrl: './edit-news-tags-modal.component.html',
  styleUrls: ['./edit-news-tags-modal.component.scss']
})
export class EditNewsTagsModalComponent implements OnInit {
  public form;
  public tags$ = this.newsService.tags$
  private userTags

  public get tags() {
    return this.form.controls.tags
  }

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<UpdateSessionModalComponent>,
    private newsService: NewsService,
    
  ) {
    const { userTags } = this.data
    this.userTags = userTags
    this.form = this.fb.group({
      tags: this.fb.array([] as FormGroup[])
    })

    this.form.valueChanges.subscribe(res => {
      // console.log(res);
    })
  }

  ngOnInit(): void {
    this.tags$
    .pipe(take(1))
    .subscribe(tags => {
      const controls = tags.map(tag => {
        const isUserTag = this.userTags.findIndex(t => t.id === tag.id) > -1 ?? false
        const control = this.fb.group({
          id: tag.id,
          name: tag.name,
          checked: isUserTag
        })
        this.form.controls.tags.push(control)
      })
    })
  }

  public submit() {
    this.dialogRef.close({
      result: 'success',
      tags: this.form.value.tags
    })    
  }

  public cancel() {
    this.dialogRef.close({
      result: 'cancel'
    })
  }
}
