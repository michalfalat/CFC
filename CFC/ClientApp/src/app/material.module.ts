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
   MatMenuModule} from '@angular/material';

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
    MatMenuModule
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
    MatMenuModule
  ],
})
export class CustomMaterialModule { }