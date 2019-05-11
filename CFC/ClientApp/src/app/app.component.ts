import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'app';
  constructor(private translate: TranslateService, private authService: AuthService, private router: Router) {
    translate.addLangs(['en', 'sk']);
    translate.setDefaultLang('en');
    
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|sk/) ? browserLang : 'en');
    
  }

  public isUserLoggedIn(){
    return this.authService.isLoggedIn();
  }

  public user() {
    return this.authService.getUser();
  }

  public changeLanguage(lang) {
    this.translate.use(lang);
    console.log(lang);
  }

  public logout(){
    this.authService.logoutUser();
    this.router.navigate(['/login']);

  }
}
