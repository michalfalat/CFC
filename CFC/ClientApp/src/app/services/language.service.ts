import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private translateService: TranslateService, private cookieService: CookieService) { 
    
    this.translateService.addLangs(['en', 'sk']);
    this.translateService.setDefaultLang('sk');
    const cookieLang = this.cookieService.get("language");    
    const browserLang = this.translateService.getBrowserLang();
    const selectedLang = cookieLang !== "" ? cookieLang : browserLang;
    
    this.translateService.use(browserLang.match(/en|sk/) ? selectedLang : 'en');
  }
  
changeLanguage(lang) {  
  this.translateService.use(lang);
  this.cookieService.set("language", lang);
}

getLanguage() {
  return this.translateService.currentLang;
}
}


