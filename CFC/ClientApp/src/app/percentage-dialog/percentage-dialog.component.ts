import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PercentageEntryData, PercentageSaveData } from '../models/percentage-models';

@Component({
  selector: 'app-percentage-dialog',
  templateUrl: './percentage-dialog.component.html',
  styleUrls: ['./percentage-dialog.component.scss']
})
export class PercentageDialogComponent {

  public newParticipant: PercentageSaveData = new PercentageSaveData();


  constructor(
    public dialogRef: MatDialogRef<PercentageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PercentageEntryData) {
    this.newParticipant = data.entryData;
    this.newParticipant.isEdit = data.isEdit;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  saveData(): void {
    this.dialogRef.close(this.newParticipant);

  }

}
