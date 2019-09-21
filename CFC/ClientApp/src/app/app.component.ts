import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { UserInfo } from './models/user-models';
import { DarkThemeService } from './services/dark-theme.service';
import { LanguageService } from './services/language.service';
import { AuthGuard } from 'src/guards/auth-guard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private userData: UserInfo = null;
  public selectedLanguage = "";
  public openedSidebar = true;

  title = 'app';
  constructor(private languageService: LanguageService, private translateService: TranslateService,
    public authService: AuthService, public darkThemeService: DarkThemeService,
    private router: Router, public authGuardService: AuthGuard) {
      this.userData = this.authService.getUser();
      this.selectedLanguage = this.languageService.getLanguage();
      this.authService.user.subscribe((user) => {
        this.userData = user;
      });
      this.translateService.onLangChange.subscribe(() => {
        this.selectedLanguage = this.languageService.getLanguage();
      });
      if (this.windowWidth() < 800) {
        this.openedSidebar = false;
      }

  }

  public navigate(route) {
    this.router.navigate([route]);
  }

  public changeLanguage(lang) {
    this.languageService.changeLanguage(lang);
  }

  public logout(){
    this.authService.logoutUser();
    this.router.navigate(['/login']);

  }

  public changeDarkTheme(event) {
    event.preventDefault();
    const enable = this.darkThemeService.darkModeEnabled == false;
    this.darkThemeService.enableDarkMode(enable);
  }

  public toogleSidebar() {
    this.openedSidebar = !this.openedSidebar;
  }

  public getYear() {
    return new Date().getFullYear();
  }

  public windowWidth() {
    return window.innerWidth;
  }

  public closeSidenav() {
    if(this.windowWidth() < 800) {
      this.openedSidebar = false;
    }
  }
}
