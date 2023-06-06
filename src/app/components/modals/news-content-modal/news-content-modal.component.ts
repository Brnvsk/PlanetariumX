import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiRoutes, apiUrl } from 'src/app/config/network.config';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/types/user.type';
import { INews, INewsTag } from 'src/app/types/news.types';

@Component({
  selector: 'app-news-content-modal',
  templateUrl: './news-content-modal.component.html',
  styleUrls: ['./news-content-modal.component.scss']
})
export class NewsContentModalComponent implements OnInit {
  public user = this.userService.user;
  public api = apiUrl
  constructor(
    private userService: UserService,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: INews,
    private dialogRef: MatDialogRef<NewsContentModalComponent>,
  ) {
    this.data.tags.forEach((tag, i, arr) => {
      arr[i].hasUser = !!this.user?.tags.find(t => t.id === tag.id)
    })

  }

  ngOnInit(): void {
    this.userService.user$.subscribe(user => this.user = user)   
  }

  public clickTag(tag: INewsTag, e: Event) {
    if (!tag.hasUser) {
      this.addUserTag(tag, e)
    } else {
      console.log('remove');
      this.removeUserTag(tag, e)
    }
  }

  private addUserTag(tag: INewsTag, e: Event) {
    if (!this.user) {
      return
    }
    
    this.disableTag(e);

    const newTags = [...this.user.tags, tag]
    const update = {
      tags: [...new Set(newTags.map(tag => tag.id))],
    }

    this.updateUserTags(this.user, update, e);
  }

  private removeUserTag(tag: INewsTag, e: Event) {
    if (!this.user) {
      return
    }
    
    const userTags = this.user.tags.map(t => t.id).filter(t => t !== tag.id)

    const update = {
      tags: userTags,
    }

    this.updateUserTags(this.user, update, e);
  }

  private updateUserTags(user: User, update: any, e: Event) {
    this.disableTag(e);
    this.http.patch<{ updated: User }>(`${ApiRoutes.users}/${user.id}`, {
      update,
    }).subscribe(res => {
      if (this.user) {
        this.userService.setUser({
          ...this.user,
          tags: [...res.updated.tags]
        })
      }
      const { tags } = res.updated
      this.data.tags = this.data.tags.map(tag => {
        return {
          ...tag,
          hasUser: tags.findIndex(userTag => userTag.id === tag.id) > -1
        }
      })
      this.enableTag(e);
    })
  }

  private disableTag(e: Event) {
    (e.target as HTMLElement).parentElement?.setAttribute('disabled', '');
  }

  private enableTag(e: Event) {
    (e.target as HTMLElement).parentElement?.removeAttribute('disabled');
  }

}
