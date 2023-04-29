import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ForwardsService } from 'src/app/shared/services/forwards.service';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';

@Component({
  selector: 'app-spy',
  templateUrl: './spy.component.html',
  styleUrls: ['./spy.component.scss']
})
export class SpyComponent {

  public numberAliens = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].sort(()=>Math.random()-0.5);
  public stage: Stages = Stages.first;

  public get Stages(): typeof Stages {
    return Stages;
  }
  constructor(
    private forward: ForwardsService,
    private dialog: MatDialog
  ) {
    localStorage.setItem('first', 'true');
    localStorage.setItem('second', 'true');
    localStorage.setItem('third', 'true');
  }

  openDialog() {
    this.dialog.open(DialogWindowComponent);
  }

  forwardGames(): void {
    this.forward.forwardGames();
  }

  findSpy(event: any) {/*
    debugger */
    if(event.target.localName !== "img") return;
    if(this.stage === this.Stages.first && !localStorage.getItem('first') ||
      this.stage === this.Stages.second && !localStorage.getItem('second') ||
      this.stage === this.Stages.third && !localStorage.getItem('third')) return;
    if(event.target.getAttribute('src') === "assets/images/greenAlienSpy.png" ||
      event.target.getAttribute('src') === "assets/images/orangeAlienSpy.png" ||
      event.target.getAttribute('src') === "assets/images/purpleAlienSpy.png") {
      let aliens = document.querySelectorAll('.whithout-spy');
      aliens.forEach(val => {
        val.setAttribute('style', 'opacity: 1; ');
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
          val.setAttribute('style', 'opacity: 0; transition: all 1s ease 0s;font-weight: bold; color: #FFFFFF')
        }))
      })
      this.stage === this.Stages.first ? localStorage.removeItem('first') :
      (this.stage === this.Stages.second ? localStorage.removeItem('second') : localStorage.removeItem('third'))
      setTimeout(() => {
        this.stage === this.Stages.first ? this.stage = this.Stages.second :
        (this.stage === this.Stages.second ? this.stage = this.Stages.third : this.openDialog())
      }, 1000)
    }
  }


}

enum Stages {
  first,
  second,
  third
}