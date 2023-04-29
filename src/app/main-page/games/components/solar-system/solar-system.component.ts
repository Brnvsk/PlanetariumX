import { CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem, CdkDragEnter, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ForwardsService } from 'src/app/shared/services/forwards.service';
import { Planets } from 'src/app/shared/types/planets.type';
import { planets } from 'src/app/types/mocData';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}


@Component({
  selector: 'app-solar-system',
  templateUrl: './solar-system.component.html',
  styleUrls: ['./solar-system.component.scss']
})
export class SolarSystemComponent  {
  public tt = false;
  public namePlanets = [
    {name: 'Меркурий', ref: 'assets/images/mercury.png'},
    {name: 'Венера', ref: 'assets/images/venera.png'},
    {name: 'Земля', ref: 'assets/images/earth.png'},
    {name: 'Марс', ref: 'assets/images/mars.png'},
    {name: 'Юпитер', ref: 'assets/images/jupiter.png'},
    {name: 'Сатурн', ref: 'assets/images/saturn.png'},
    {name: 'Уран', ref: 'assets/images/uran.png'}
  ]
  public tempPlanets!: any;
  public items: string[] = [ ];
  public basket = [{img: 'assets/images/boxForPlanet.png', visibility: false},
  {img: 'assets/images/boxForPlanet.png', visibility: false},
  {img: 'assets/images/boxForPlanet.png', visibility: false},
  {img: 'assets/images/boxForPlanet.png', visibility: false},
  {img: 'assets/images/boxForPlanet.png', visibility: false},
  {img: 'assets/images/boxForPlanet.png', visibility: false},
  {img: 'assets/images/boxForPlanet.png', visibility: false}];


  constructor(
    private route: ActivatedRoute,
    private forward: ForwardsService,
    public dialog: MatDialog
  ) {
    this.tempPlanets = [...planets].map(i=>[Math.random(), i]).sort().map(i=>i[1]);
    for(let item of this.tempPlanets) {
      this.items.push(item.img)
    }

  }

  openDialog() {
    this.dialog.open(DialogWindowComponent, {
      data: {
        animal: 'panda',
      },
    });
  }

  forwardGames(): void {
    this.forward.forwardGames();
  }

  checkBeforeDrag(event: any) {
    event.target.getAttribute('src') === 'assets/images/cell.png' ? this.tt = true : this.tt = false;
  }

  drop(event: CdkDragDrop<{img: string; visibility: boolean;}[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {

      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.basket[event.currentIndex] = {img: String(this.basket[event.currentIndex]), visibility: false};

      let start = document.querySelectorAll('.start');
      start.forEach((value, key, self) => {
        let temp = value.querySelector('img');
        this.basket.forEach(basValue => {
          if(basValue.img === temp?.getAttribute('src')) {
            temp.setAttribute('src', 'assets/images/cell.png');
            let span = document.createElement('span');
            span.style.color = "#FFFFFF"
            value.append(span);
          }
        })
      })
      for(let i = this.basket.length - 1; i >= 0; i--) {
        if(this.basket[i].img === 'assets/images/boxForPlanet.png') {
          this.basket.splice(i, 1);
          break;
        }
      }
    }

    this.basket.forEach((val, index) => {
      planets.forEach((valPlanet, indexPlanet) => {
        if(val.img === valPlanet.img) {
          index === indexPlanet ? val.visibility = false : val.visibility = true;
        }
      })
    })
    let asd = this.basket.find(val => {
      if(val.img === 'assets/images/boxForPlanet.png') {
        return true;
      } else {
        return false;
      }
    })
    if(this.basket.find(val => val.visibility == true) === undefined && asd === undefined) {
      this.endGame();
    }

  }

  endGame() {
    this.openDialog();
  }

  noReturnPredicate() {
    return false;
  }

}
