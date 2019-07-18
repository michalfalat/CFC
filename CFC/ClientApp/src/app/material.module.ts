import { NgModule, ErrorHandler } from '@angular/core';
import { MatButtonModule, MatCheckboxModule,  MatInputModule, MatToolbarModule, MatIconModule,
   MatExpansionModule,
   MatCardModule,
   MatListModule,
   MatSnackBarModule,
   MatProgressBarModule,
   MatProgressSpinnerModule,
   MatTableModule,
   MatTabsModule,
   MatTooltipModule,
   MatDividerModule,
   MatMenuModule,
   MatSlideToggleModule} from '@angular/material';

@NgModule({
  imports:  [
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatExpansionModule,
    MatCardModule,
    MatListModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatDividerModule,
    MatMenuModule,
    MatSlideToggleModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatExpansionModule,
    MatCardModule,
    MatListModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatDividerModule,
    MatMenuModule,
    MatSlideToggleModule
  ],
})
export class CustomMaterialModule { }