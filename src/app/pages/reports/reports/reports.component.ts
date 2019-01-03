import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

import { Entry } from '../../entries/shared/entry.model';
import { EntryService } from '../../entries/shared/entry.service';

import currencyFormater from 'currency-formatter';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  revenueTotal: any = currencyFormater.format(0, { code: 'BRL'});
  expenseTotal: any = currencyFormater.format(0, { code: 'BRL'});
  balance: any = currencyFormater.format(0, { code: 'BRL'});

  expenseChartData: any;
  revenueChartData: any;

  chartOptions = {
    scales: {
      yAxes: [{ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  categories: Category[] = []
  entries: Entry[] = []

  @ViewChild('month') month: ElementRef = null;
  @ViewChild('year') year: ElementRef = null;

  constructor(private entryService: EntryService, private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAll()
      .subscribe(categories => this.categories = categories)
  }

  public generateReport() {
    const month = this.month.nativeElement.value;
    const year = this.year.nativeElement.value;
    if (this.validateGenerateReport(month, year)) {
      this.entryService.getByMontAndYear(month, year)
        .subscribe(this.setValues.bind(this))
    }
  }

  private validateGenerateReport(month: any, year: any): boolean {
    if (!month || !year) {
      alert('Selecione um mês e um ano para gerar o relatório');
      return false;
    }
    return true;
  }

  private setValues (entries: Entry[]) {
    this.entries = entries;
    this.calculateBalance();
    this.setChartData();
  }

  private calculateBalance() {
    let expenseTotal = 0;
    let revenueTotal = 0;
    this.entries.forEach(entry => {
      if (entry.type == 'revenue') {
        revenueTotal += currencyFormater.unformat(entry.amount, { code: 'BRL' });
      } else {
        expenseTotal += currencyFormater.unformat(entry.amount, { code: 'BRL' });
      }
    });
    this.expenseTotal = currencyFormater.format(expenseTotal, { code: 'BRL'});
    this.revenueTotal = currencyFormater.format(revenueTotal, { code: 'BRL'});
    this.balance = currencyFormater.format(revenueTotal - expenseTotal, { code: 'BRL'});
  }

  private setChartData() {
    this.revenueChartData = this.getChartData('revenue', 'Cráfico de Receitas', '#9CCC65');
    this.expenseChartData = this.getChartData('expense', 'Gráfico de Despesas', '#e03131');
  }

  private getChartData(entryType: string, chartTitle: string, color: string) : any {
    const chartData = [];

    this.categories.forEach(category => {
      const filteredEntries = this.entries.filter(
        entry => (entry.categoryId == category.id) && (entry.type == entryType)
      );
      if (filteredEntries.length > 0) {
        const totalAmount = filteredEntries.reduce(
          (total, entry) => total + currencyFormater.unformat(entry.amount, { code: 'BRL' }), 0
        );
        chartData.push({
          categoryName: category.name,
          totalAmount: totalAmount
        });
      }
    });

    return {
      labels: chartData.map(item => item.categoryName),
      datasets: [{
        label: chartTitle,
        backgroundColor: color,
        data: chartData.map(item=> item.totalAmount)
      }]
    };

  }

}
