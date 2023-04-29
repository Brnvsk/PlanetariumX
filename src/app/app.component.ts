import { Component, OnInit } from '@angular/core';
import { NewsService } from './services/news.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private newsService: NewsService, private userService: UserService) {
    newsService.loadTags()
    const token = localStorage.getItem('token')
    userService.getUserByToken(token)
  }
}
