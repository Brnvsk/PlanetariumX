import { Injectable, Input } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export  class ChangeProgressService {

  private progressBar!: Element | null;
  private first!: Element | null;
  private last!: Element | null;
  private star!: HTMLImageElement | null;
  private progressValue: number = 0;

  constructor() { }

 changeProgress(event: any): number {
    this.first = document.querySelector('#first');
    this.last = document.querySelector('#last');
    this.progressBar = document.querySelector('.header-progress');
    this.star = document.querySelector('.star');//потом будут проблемы с полосой скролла
    event.target === this.first ? this.progressValue = 0 : this.progressValue = Math.abs(((((window.innerWidth - this.progressBar!.clientWidth)/2 - event.target.offsetLeft) - this.progressBar!.clientWidth/4) - event.target.clientWidth/2 ) + this.progressBar!.clientWidth/4)*0.25;
    if(event.target === this.last){
      this.star!.style.left = 400 - this.star!.clientWidth/2 + "px";
      this.progressValue = 100
    } else {
      this.star!.style.left = this.progressValue*4 - this.star!.clientWidth/2 + "px";
    }

    return this.progressValue;
  }
}
