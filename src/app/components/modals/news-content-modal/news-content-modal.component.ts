import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { apiUrl } from 'src/app/config/network.config';
import { INews } from 'src/app/types/news.types';

@Component({
  selector: 'app-news-content-modal',
  templateUrl: './news-content-modal.component.html',
  styleUrls: ['./news-content-modal.component.scss']
})
export class NewsContentModalComponent {
  public api = apiUrl
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: INews,
    private dialogRef: MatDialogRef<NewsContentModalComponent>,
  ) {
    console.log(data);
  }

}
