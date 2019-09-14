import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ThemeService } from 'ng2-charts';
import { ChartOptions } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class DarkThemeService {

  public darkModeEnabled = false;

  constructor(private cookieService: CookieService, private chartThemeService: ThemeService) {
    const cookieVal = cookieService.get('dark_mode');
    console.log(cookieVal);
    this.darkModeEnabled =  cookieVal !== '' ? JSON.parse(cookieVal) : false;
  }

  public enableDarkMode(enabled: boolean) {
    this.darkModeEnabled = enabled;
    this.cookieService.set('dark_mode', JSON.stringify(enabled));
    this.switchChartTheme(enabled);
  }

  private switchChartTheme(enabled) {
    let overrides: ChartOptions;
    if (enabled ) {
      overrides = {
        legend: {
          labels: { fontColor: 'white' }
        },
        scales: {
          xAxes: [{
            ticks: { fontColor: 'white' },
            gridLines: { color: 'rgba(255,255,255,0.1)' }
          }],
          yAxes: [{
            ticks: { fontColor: 'white' },
            gridLines: { color: 'rgba(255,255,255,0.1)' }
          }]
        },
        plugins: {
          datalabels: {
            color: '#fff',
          },
        },
      };
    } else {
      overrides = {};
    }
    this.chartThemeService.setColorschemesOptions(overrides);
  }
}
