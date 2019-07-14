import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { UserInfo } from './models/login-user';
import { DarkThemeService } from './services/dark-theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private userData: UserInfo = null;
  
  title = 'app';
  constructor(private translate: TranslateService, 
    public authService: AuthService, public darkThemeService: DarkThemeService,
    private router: Router) {
    translate.addLangs(['en', 'sk']);
    translate.setDefaultLang('en');
    
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|sk/) ? browserLang : 'en');
    this.userData = this.authService.getUser();
    this.authService.user.subscribe((user) => {
      this.userData = user;
    })
    
  }

  public navigate(route) {
    this.router.navigate([route]);
  }
  
  public changeLanguage(lang) {
    this.translate.use(lang);
    console.log(lang);
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

  public getYear() {
    return new Date().getFullYear();
  }
}
