import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'app';
  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'sk']);
    translate.setDefaultLang('en');
    
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|sk/) ? browserLang : 'en');
    
  }

  public changeLanguage(lang) {
    this.translate.use(lang);
    console.log(lang);
  }
}
