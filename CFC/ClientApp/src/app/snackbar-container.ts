import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Component, Inject } from '@angular/core';
// ...

@Component({
  selector: 'app-snackbar-component',
  template: `<div style="display:flex; align-items:center"><mat-icon>{{ data?.icon }}</mat-icon> <span style="margin-left:5px;">{{ data?.message }}</span></div>`
})
  // Most likely you have to add styles in order to position the icon, although I haven't tested it yet
export class IconSnackBarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}
