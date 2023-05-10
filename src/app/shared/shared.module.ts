import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from "@angular/material/icon";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    MatProgressBarModule,
    MatMenuModule,
    MatDatepickerModule,
    MatRadioModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
  ],
  exports: [
    MatProgressBarModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatRadioModule,
    MatSelectModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
