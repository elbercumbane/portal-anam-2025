import { Component, Input } from '@angular/core';
import { ChartDataService } from '../../../services/chart-data.service';
import { SatisfactionData } from '../../../services/satisfaction.service';

@Component({
  selector: 'app-satisfaction-pie-chart',
  templateUrl: './satisfaction-pie-chart.component.html',
  styleUrls: ['./satisfaction-pie-chart.component.scss']
})
export class SatisfactionPieChartComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = 'pie_chart';
  @Input() cardClass = '';
  @Input() satisfactionData: SatisfactionData[] = [];
  @Input() totalValue = 0;

  constructor(private chartDataService: ChartDataService) {}

  hasData(): boolean {
    return !!this.satisfactionData && this.satisfactionData.length > 0;
  }

  getPieDashArray(value: number): number {
    return this.chartDataService.getPieDashArray(value);
  }

  getPieSegmentOffset(index: number): number {
    if (!this.hasData() || index === 0) {
      return 0;
    }

    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += this.satisfactionData[i]?.value || 0;
    }
    return this.chartDataService.getPieDashOffset(offset);
  }
}

