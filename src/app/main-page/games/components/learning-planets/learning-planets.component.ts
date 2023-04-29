import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ForwardsService } from 'src/app/shared/services/forwards.service';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';

@Component({
  selector: 'app-learning-planets',
  templateUrl: './learning-planets.component.html',
  styleUrls: ['./learning-planets.component.scss']
})



export class LearningPlanetsComponent {

  public namePlanets = [
    {name:'Марс', img: 'assets/images/marsLearn.png'},
    {name:'Венера', img: 'assets/images/venusLearn.png'},
    {name:'Юпитер', img: 'assets/images/jupiterLearn.png'},
    {name:'Земля', img: 'assets/images/earthLearn.png'},
    {name:'Нептун', img: 'assets/images/neptunLearn.png'},
    {name:'Уран', img: 'assets/images/uranLearn.png'},
    {name:'Сатурн', img: 'assets/images/saturnLearn.png'},
    {name:'Меркурий', img: 'assets/images/mercuryLearn.png'}
  ]
  public numberNames = [{name: 'Марс'},
  {name: 'Венера', status: colorBtn.disabled},
  {name: 'Юпитер', status: colorBtn.disabled},
  {name: 'Земля', status: colorBtn.disabled},
  {name: 'Нептун', status: colorBtn.disabled},
  {name: 'Уран', status: colorBtn.disabled},
  {name: 'Сатурн', status: colorBtn.disabled},
  {name: 'Меркурий', status: colorBtn.disabled}
  ].sort(()=>Math.random()-0.5);
  public saturn = 'Сатурн';
  public btnDisabled: boolean = true;
  public currentPlanet: string = '';
  public get colorBtn(): typeof colorBtn {
    return colorBtn;
  }
  constructor(
    private forward: ForwardsService,
    private dialog: MatDialog
  ) { }

  openDialog() {
    this.dialog.open(DialogWindowComponent);
  }

  forwardGames(): void {
    this.forward.forwardGames();
  }

  selectedPlanet(event: any): void {
    this.numberNames.forEach(val => val.status = colorBtn.selected);
    this.btnDisabled = false;
    this.currentPlanet = event.target.getAttribute('src');
  }

  selectedName(event: any): void {
    let temp = this.namePlanets.find(val => val.img === this.currentPlanet);
    if(temp?.name === event.target.parentNode.textContent.trim())  {
      event.target.parentNode.hidden = false;
      event.target.parentNode.style.opacity = 0;
      event.target.parentNode.style.transition = "1s";
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        event.target.parentNode.opacity = 1
      }))
      let names = document.querySelectorAll('.names-all');
      names.forEach(val => {
        if(val.textContent === event.target.parentNode.textContent.trim()) {
          val.setAttribute('style', 'opacity: 0; ');
          event.target.parentNode.disabled = true;
          window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
            val.setAttribute('style', 'opacity: 1; transition: all 1s ease 0s;font-weight: bold; color: #FFFFFF')
          }))
          event.target.parentNode.classList.add('done');
        }
      })
      this.numberNames.forEach(val => {
        val.status = colorBtn.disabled;
        this.btnDisabled = true;
      })
    } else {
      this.numberNames.forEach(val => {
        if(event.target.parentNode.textContent.trim() === val.name) {
          val.status = colorBtn.fail;
          this.btnDisabled = true;
          setTimeout(() => {
            val.status = colorBtn.selected;
            this.btnDisabled = false;
          },1500)
        }
      })
    }
    let done = document.querySelectorAll('.done');
    if(done.length === 8) {
      this.openDialog();
    }
  }
}

enum colorBtn {
  disabled,
  selected,
  fail
}