import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { DateAdapter } from '@angular/material/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private translateService: TranslateService, private cookieService: CookieService, private dateAdapter: DateAdapter<any>) {
    this.translateService.addLangs(['en', 'sk']);
    this.translateService.setDefaultLang('sk');
    const cookieLang = this.cookieService.get('language');
    const browserLang = 'sk'; // this.translateService.getBrowserLang();
    const selectedLang = cookieLang !== '' ? cookieLang : browserLang;

    this.translateService.use(browserLang.match(/en|sk/) ? selectedLang : 'sk');
  }

  changeLanguage(lang) {
    const currentDate = new Date();
    const year = currentDate.getFullYear() + 10;
    currentDate.setFullYear(year);
    this.translateService.use(lang);
    this.cookieService.set('language', lang, currentDate, '/');
    this.dateAdapter.setLocale(this.getLanguage());
  }

  getLanguage() {
    return this.translateService.currentLang;
  }

  getDateFormat() {
    return this.translateService.currentLang === 'sk' ? 'dd.MM.yyyy' : 'MM/dd/yyyy';
  }
}


