import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { SolarPlanet } from '../../config';

@Component({
  selector: 'app-details-popup',
  templateUrl: './details-popup.component.html',
  styleUrls: ['./details-popup.component.scss']
})
export class DetailsPopupComponent implements OnDestroy {
  @Input() data!: SolarPlanet

  @Output() close = new EventEmitter()

  public playSound() {
    if (this.data.sound) {
      this.data.sound.play()
    }
  }

  public onClose() {
    this.close.emit()
  }

  public ngOnDestroy(): void {
    if (this.data.sound){
      this.data.sound.pause()
      this.data.sound.currentTime = 0;
    }
  }
} 
