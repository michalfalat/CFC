import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { _ } from 'underscore';
import { TranslateService } from '@ngx-translate/core';
import { DarkThemeService } from '../services/dark-theme.service';

@Component({
  selector: 'app-chart-data',
  templateUrl: './chart-data.component.html',
  styleUrls: ['./chart-data.component.scss']
})
export class ChartDataComponent implements OnInit {
  @Input() public data;
  @Input() public type;
  @Input() public companyOffices = [];

  public groupedBy = 'day';

  private depositLabel = 'Deposits';
  private withdrawLabel = 'Withdraws';
  private expenseLabel = 'Expenses';
  private incomeLabel = 'Incomes';

  public barChartData: ChartDataSets[] = [];
  public barChartOptions: ChartOptions = {
    tooltips: {
      mode: 'label',
      callbacks: {
        // title: function(tooltipItems, data) {
        //     return 'hhh';//_this.chart.data.labels[tooltipItems[0].index];
        // },
        // footer: function(tooltipItems, data) {
        //     let total = 0;
        //     for (let i = 0; i < tooltipItems.length; i++) {
        //         total += parseInt(tooltipItems[i].yLabel + '', 10);
        //     }
        //     return 'Total: ' + total;
        // }
        label: function (tooltipItem, data) {
          const group = data.datasets[tooltipItem.datasetIndex].label;
          const valor = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          let total = 0;
          for (let i = 0; i < data.datasets.length; i++) {
            total += Number(data.datasets[i].data[tooltipItem.index]);
          }
          // tslint:disable-next-line:triple-equals
          if (tooltipItem.datasetIndex != data.datasets.length - 1) {
            return `${ group } : ${ valor }€`;
          } else {
            return [`${ group } : ${ valor }€`];
          }
        }
      }
    },
    legend: {
      position: 'bottom',
      labels: {
        fontColor: this.themeService.darkModeEnabled ? 'white' : '',
      },
      onClick: (e) => e.stopPropagation()
    },
    responsive: true,
    maintainAspectRatio: false,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{
        // categoryPercentage: 1.0,
        // barPercentage: 1.0,
        maxBarThickness: 200,
      }]
        // gridLines: {
        //   display: false
        // },
      // }], yAxes: [{
      //   stacked: true,
      // }]
    },
    plugins: {
      datalabels: {
        color: this.themeService.darkModeEnabled ? '#fff' : '#2a2a2a',
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value, ctx) => {

          // Array of visible datasets :
          const datasets = ctx.chart.data.datasets; // .filter(
          // ds => !ds._meta[0].hidden
          // ds => ctx.chart.isDatasetVisible(ds.datasetIndex) // <-- does not work
          //  );

          // If this is the last visible dataset of the bar :
          if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
            let sum = 0;
            datasets.filter(d => d.stack === '2').map(dataset => {
              sum += Number(dataset.data[ctx.dataIndex]);
            });
            return `${ sum } €`;
          } else if (datasets.indexOf(ctx.dataset) === datasets.length - 3) {
            let sum = 0;
            datasets.filter(d => d.stack === '1').map(dataset => {
              sum += Number(dataset.data[ctx.dataIndex]);
            });
            return `${ sum.toFixed(2) } €`;
          }
          return '';

        },
        anchor: 'end',
        align: 'end'
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 50,
        bottom: 50
      }
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];


  constructor(private translateService: TranslateService, private themeService: DarkThemeService) { }

  ngOnInit() {
    this.depositLabel = this.translateService.instant('deposits2');
    this.withdrawLabel = this.translateService.instant('withdraws2');
    this.expenseLabel = this.translateService.instant('expenses');
    this.incomeLabel = this.translateService.instant('incomes');
    this.manageData();
  }

  manageData() {
    if (this.data !== undefined) {
      this.data = this.data.sort((a, b) => (new Date(a.createdAt) > new Date(b.createdAt)) ? 1 : -1);
    }
    let groupedData = null;
    switch (this.groupedBy) {
      case 'day':
        groupedData = _.groupBy(this.data, function (item) {
          return new Date(item.createdAt.substring(0, 10)).toLocaleDateString();
        });
        break;
      case 'month':
        groupedData = _.groupBy(this.data, function (item) {
          return `${ new Date(item.createdAt.substring(0, 7)).toLocaleString('default', { month: 'long' })} ${ new Date(item.createdAt.substring(0, 7)).getFullYear() }`;
        });
        break;
      case 'year':
        groupedData = _.groupBy(this.data, function (item) {
          return item.createdAt.substring(0, 4);
        });
        break;
      default:
        break;
    }
    const expensesArray = [];
    const incomesArray = [];
    const withdrawsArray = [];
    const depositsArray = [];
    Object.keys(groupedData).forEach((groupedBy) => {
      const expensesSum = groupedData[groupedBy].filter(d => d.type === 1).reduce((a, b) => a + (this.calcAmount(b) || 0), 0);
      const incomesSum = groupedData[groupedBy].filter(d => d.type === 2).reduce((a, b) => a + (this.calcAmount(b) || 0), 0);
      const withdrawSum = groupedData[groupedBy].filter(d => d.type === 3).reduce((a, b) => a + (b['amount'] || 0), 0);
      const depositSum = groupedData[groupedBy].filter(d => d.type === 4).reduce((a, b) => a + (b['amount'] || 0), 0);

      expensesArray.push(expensesSum);
      incomesArray.push(incomesSum);

      withdrawsArray.push(withdrawSum);
      depositsArray.push(depositSum);
    });
    this.barChartLabels = Object.keys(groupedData);
    this.barChartData = [
      { data: expensesArray, label: this.expenseLabel, backgroundColor: '#ce4949', hoverBackgroundColor: '#ce4949bb', stack: '1' },
      { data: withdrawsArray, label: this.withdrawLabel, backgroundColor: '#c18443', hoverBackgroundColor: '#c18443bb', stack: '1' },
      { data: incomesArray, label: this.incomeLabel, backgroundColor: '#69b148', hoverBackgroundColor: '#69b148bb', stack: '2' },
      { data: depositsArray, label: this.depositLabel, backgroundColor: '#96b148', hoverBackgroundColor: '#96b148bb', stack: '2' }
    ];
  }

  calcAmount(element) {
    if (this.type === 'company') {
      if (element.officeId === null) {
        return element.amount;
      } else {
        const companyOffice = this.companyOffices.find(a => a.officeId === element.officeId);
        if (companyOffice !== undefined) {
          const percentage = companyOffice.percentage;
          return element.amount / 100 * percentage;
        }
      }
    } else {
      return element.amount;
    }
  }
}
