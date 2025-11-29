import { Component, Input } from '@angular/core';
import { ChartDataService, MonthlyFormData, PerformanceData } from '../../../services/chart-data.service';

interface ChartSeries {
  key: keyof MonthlyFormData;
  label: string;
  color: string;
}

@Component({
  selector: 'app-monthly-evaluations-chart',
  templateUrl: './monthly-evaluations-chart.component.html',
  styleUrls: ['./monthly-evaluations-chart.component.scss']
})
export class MonthlyEvaluationsChartComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = 'trending_up';
  @Input() performanceData: PerformanceData[] = [];
  @Input() monthlyFormData: MonthlyFormData = {
    fae: [],
    economicAgent: [],
    userEvaluation: [],
    training: []
  };

  readonly series: ChartSeries[] = [
    { key: 'fae', label: 'FAE', color: '#3B82F6' },
    { key: 'economicAgent', label: 'Agente Econômico', color: '#F59E0B' },
    { key: 'userEvaluation', label: 'Utilizador', color: '#10B981' },
    { key: 'training', label: 'Formando', color: '#06B6D4' }
  ];

  private readonly chartWidth = 600;
  private readonly chartHeight = 240;
  private readonly chartXStart = 40;
  private readonly chartYBaseline = 260;

  constructor(private chartDataService: ChartDataService) {}

  get hasData(): boolean {
    return this.performanceData && this.performanceData.length > 0;
  }

  get maxValue(): number {
    const value = this.chartDataService.getMaxMonthlyValue(this.performanceData);
    return value || 100;
  }

  getMonthlyPath(key: keyof MonthlyFormData): string {
    const data = this.monthlyFormData?.[key] || [];
    return this.chartDataService.getMonthlyLinePath(data, this.maxValue);
  }

  getPointX(index: number): number {
    if (!this.performanceData || this.performanceData.length <= 1) {
      return this.chartXStart;
    }
    const step = this.chartWidth / (this.performanceData.length - 1);
    return this.chartXStart + (index * step);
  }

  getPointY(value: number): number {
    if (value === undefined || value === null) {
      return this.chartYBaseline;
    }
    return this.chartYBaseline - ((value / this.maxValue) * this.chartHeight);
  }
}

