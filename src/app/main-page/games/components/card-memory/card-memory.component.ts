import { AfterContentInit, AfterViewInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ForwardsService } from 'src/app/shared/services/forwards.service';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';

@Component({
  selector: 'app-card-memory',
  templateUrl: './card-memory.component.html',
  styleUrls: ['./card-memory.component.scss']
})
export class CardMemoryComponent implements AfterViewInit {
  private audio = new Audio("assets/audio/solar.mp3");

  public tempSeconds: boolean = false;
  public numberCards = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].sort(()=>Math.random()-0.5);
  public items = [
    {
      td: 0,
      tr: [
        { value: `assets/images/card${this.numberCards[0]}.png`,mystery: 'assets/images/mysteryCard.png'},
        { value: `assets/images/card${this.numberCards[1]}.png`,mystery: 'assets/images/mysteryCard.png'},
        { value: `assets/images/card${this.numberCards[2]}.png`,mystery: 'assets/images/mysteryCard.png'},
        { value: `assets/images/card${this.numberCards[3]}.png`,mystery: 'assets/images/mysteryCard.png'}
      ],
    },
    {
      td: 1,
      tr: [
        { value: `assets/images/card${this.numberCards[4]}.png`,mystery: 'assets/images/mysteryCard.png'},
        { value: `assets/images/card${this.numberCards[5]}.png`,mystery: 'assets/images/mysteryCard.png'},
        { value: `assets/images/card${this.numberCards[6]}.png`,mystery: 'assets/images/mysteryCard.png'},
        { value: `assets/images/card${this.numberCards[7]}.png`,mystery: 'assets/images/mysteryCard.png'}
      ],
    },
    {
      td: 2,
      tr: [
        { value: `assets/images/card${this.numberCards[8]}.png`,mystery: 'assets/images/mysteryCard.png'},
        { value: `assets/images/card${this.numberCards[9]}.png`,mystery: 'assets/images/mysteryCard.png'},
        { value: `assets/images/card${this.numberCards[10]}.png`,mystery: 'assets/images/mysteryCard.png'},
        { value: `assets/images/card${this.numberCards[11]}.png`,mystery: 'assets/images/mysteryCard.png'}
        ],
    },
    {
      td: 3,
      tr: [
        { value: `assets/images/card${this.numberCards[12]}.png`,mystery: 'assets/images/mysteryCard.png'},
        { value: `assets/images/card${this.numberCards[13]}.png`,mystery: 'assets/images/mysteryCard.png'},
        { value: `assets/images/card${this.numberCards[14]}.png`,mystery: 'assets/images/mysteryCard.png'},
        { value: `assets/images/card${this.numberCards[15]}.png`,mystery: 'assets/images/mysteryCard.png'}
        ],
    }
  ];
  private currentCards: any = [];
  private count: number = 0;
  private twoCards: string[] = [];
  private startGameFlag: boolean = false;
  constructor(
    private forward: ForwardsService,
    private dialog: MatDialog
  ) { }

  ngAfterViewInit(): void {
    this.items.forEach(val => {
      val.tr.forEach(valTr => this.currentCards.push(valTr));
    })
  }

  openFinalDialog() {
    this.dialog.open(DialogWindowComponent);
  }

  forwardGames(): void {
    this.forward.forwardGames();
  }

  startGame(): void {
    this.startGameFlag = true;
    this.openDialog();
  }

  tempTime() {
    this.tempSeconds = true;
    setTimeout(() => {
      this.tempSeconds = false;
    }, 2000)
  }

  openDialog(): void {
    this.forward.cardMemory = true;
    const dialogRef = this.dialog.open(DialogWindowComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.forward.cardMemory = false;
      this.forward.setCustomValue();
      this.tempTime();
    })
    dialogRef.afterOpened().subscribe(result => this.forward.change())
  }
  playAudio(){ 
    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio.play();

  }
 
  finishGame() {
    let cards = document.querySelectorAll('.cards');
    let result = Array.from(cards).find(val => val.getAttribute('src') === 'assets/images/mysteryCard.png');
    if(!result){this.openFinalDialog(); this.startGameFlag = false;}

  }

  async turnCard(event: any) {
    if(!this.startGameFlag) return;
    this.count++;
    if(this.count > 2) return;
    let x = event.target.parentNode.parentNode.cellIndex;
    let y = event.target.parentNode.parentNode.parentNode.rowIndex;
    let currentIndex = y*4 + x;
    event.target.setAttribute('src',this.currentCards[currentIndex].value)
    this.twoCards.push(event.target.getAttribute('src'))
    if(this.count === 2) {
      let firstCard = Number(this.twoCards[0].replace(/[^\d]/g, ''));
      let secondCard = Number(this.twoCards[1].replace(/[^\d]/g, ''));
      let temp;
      if(firstCard > secondCard) {
        if(firstCard % 2 === 0) {
          temp = firstCard - secondCard;
        }
      } else {
        if(secondCard % 2 === 0) {
          temp = secondCard - firstCard;
        }
      }
      if(temp !== 1) {
        let cards = document.querySelectorAll('.cards');
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            cards.forEach(val => {
              if(val.getAttribute('src') === this.twoCards[0]) resolve(val.setAttribute('src', 'assets/images/mysteryCard.png'));
              if(val.getAttribute('src') === this.twoCards[1]) resolve(val.setAttribute('src', 'assets/images/mysteryCard.png'));
            })
          }, 1000)
        })
      }
      this.finishGame()
      this.twoCards = [];
      temp = 0;
      this.count = 0;
    }
  }
}
