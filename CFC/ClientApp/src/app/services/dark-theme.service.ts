import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class DarkThemeService {
  
  public darkModeEnabled = false;

  constructor(private cookieService: CookieService) { 
    const cookieVal = cookieService.get("dark_mode");
    console.log(cookieVal);
    this.darkModeEnabled =  cookieVal !== "" ? JSON.parse(cookieVal) : false;
  }

  public enableDarkMode(enabled: boolean){
    this.darkModeEnabled = enabled;
    this.cookieService.set("dark_mode", JSON.stringify(enabled));
  }
}
