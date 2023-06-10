import { Injectable, Input } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export  class ChangeProgressService {

  private progressBar!: Element | null;
  
  private progressValue: number = 0;

  constructor() { }

 changeProgress(event: Event): number {
    const target = event.target as HTMLElement

    const left = this.getLinkCenterX(target)
    return left;
  }

  private getLinkHalfWidth(link: HTMLElement) {
    return link.clientWidth / 2;
  }

  private getLinkCenterX(link: HTMLElement): number {
    return link.offsetLeft + this.getLinkHalfWidth(link)
  }
}
