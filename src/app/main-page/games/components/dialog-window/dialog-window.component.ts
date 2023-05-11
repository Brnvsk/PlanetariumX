import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ForwardsService } from 'src/app/shared/services/forwards.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dialog-window',
  templateUrl: './dialog-window.component.html',
  styleUrls: ['./dialog-window.component.scss']
})
export class DialogWindowComponent {

  public cardMemory: boolean = this.forward.cardMemory;
  public seconds!: number;
  public seconds$: Observable<number> = this.forward.seconds$;
  constructor(
    public dialogRef: MatDialogRef<any>,
    private forward: ForwardsService,
    ) {
      forward.seconds$.subscribe(value => {
        this.seconds = value;
        if(this.seconds === 0) this.dialogRef.close();
      });
    }
  forwardGames(): void {
    this.forward.forwardGames();
    this.dialogRef.close();
    this.forward.cardMemory = false;
  }
}
