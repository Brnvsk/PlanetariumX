import { Component } from '@angular/core';
import { ForwardsService } from 'src/app/shared/services/forwards.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {

  constructor(private forward: ForwardsService) {}

  home(): void {
    this.forward.forwardView();
  }
}
