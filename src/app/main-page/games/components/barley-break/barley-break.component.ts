import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ForwardsService } from 'src/app/shared/services/forwards.service';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';

@Component({
  selector: 'app-barley-break',
  templateUrl: './barley-break.component.html',
  styleUrls: ['./barley-break.component.scss']
})
export class BarleyBreakComponent {

  private audio = new Audio("assets/audio/barley.mp3");
  public numberPazles = [1,2,3,4,5,6,7,8].sort(()=>Math.random()-0.5);
  public items = [
    {
      td: 0,
      tr: [404, this.numberPazles[0], this.numberPazles[1]]
    },
    {
      td: 1,
      tr: [this.numberPazles[2], this.numberPazles[3], this.numberPazles[4]]
    },
    {
      td: 2,
      tr: [this.numberPazles[5], this.numberPazles[6], this.numberPazles[7]]
    }
  ];

  private tempImg!: string;
  private rightPazle = ["", "assets/images/pazle1.png", "assets/images/pazle2.png", "assets/images/pazle3.png", "assets/images/pazle4.png", "assets/images/pazle5.png", "assets/images/pazle6.png", "assets/images/pazle7.png", "assets/images/pazle8.png"]
  private currentPazle: string[] = [];
  constructor(
    private forward: ForwardsService,
    public dialog: MatDialog
  ) {}

  openDialog() {
    this.dialog.open(DialogWindowComponent);
  }

  forwardGames(): void {
    this.forward.forwardGames();
  }

  async delEl(event: any) {
    let div = document.querySelectorAll('.pazle');
    let flag: boolean = false;
    div.forEach((val) => {
      if(!val.getAttribute('src')) flag = true;
    })
    if(flag && this.pazlesFilter(event)) {
      this.currentPazle = [];
      this.tempImg = event.target.getAttribute('src');
      event.target.hidden = false;
      event.target.style.opacity = 0;
      event.target.style.transition = "1s";
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        event.target.opacity = 1
      }))
      this.addEl();
      await new Promise((resolve, reject) => {
        setTimeout(() => resolve(event.target.setAttribute('src', '')), 1000)
      });
    }
    let pazles = document.querySelectorAll('.pazle');
    pazles.forEach(val => {
      this.currentPazle.push(String(val.getAttribute('src')));
    })

    if(JSON.stringify(this.currentPazle) === JSON.stringify(this.rightPazle)) {
      this.endGame();
    }
  }

  addEl() {
    let div = document.querySelectorAll('.pazle');
    div.forEach((val) => {
      if(!val.getAttribute('src')) {
        if(val.getAttribute('style')) {
          val.setAttribute('style', 'opacity: 1; transition: all 1s ease 0s;')
        }
        val.setAttribute('style', 'opacity: 0;');
        val.setAttribute('src', this.tempImg);
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
          val.setAttribute('style', 'opacity: 1; transition: all 1s ease 0s;')
        }))
      }
    })
  }

  pazlesFilter(event: any): boolean {
    let pazles = document.querySelectorAll('.pazle');
    let empty: any;
    pazles.forEach(val => {
      if(val.getAttribute('src') === "") empty = val;
    })
    return (
      empty.parentNode.parentNode.cellIndex === event.target.parentNode.parentNode.cellIndex
      || Math.abs(empty.parentNode.parentNode.cellIndex - event.target.parentNode.parentNode.cellIndex) === 1
      ) && (
        empty.parentNode.parentNode.parentNode.rowIndex === event.target.parentNode.parentNode.parentNode.rowIndex
        || Math.abs(empty.parentNode.parentNode.parentNode.rowIndex - event.target.parentNode.parentNode.parentNode.rowIndex) === 1
      ) && (empty.parentNode.parentNode.cellIndex === event.target.parentNode.parentNode.cellIndex ||
        empty.parentNode.parentNode.parentNode.rowIndex === event.target.parentNode.parentNode.parentNode.rowIndex) ? true : false;
  }

  endGame() {
    this.openDialog();
  }
  playAudio(){ 
    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio.play();

  }
 

}
