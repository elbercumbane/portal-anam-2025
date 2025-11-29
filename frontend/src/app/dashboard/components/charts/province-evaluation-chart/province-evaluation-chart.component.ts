import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProvinceEvaluationData } from '../../../services/chart-data.service';

@Component({
  selector: 'app-province-evaluation-chart',
  templateUrl: './province-evaluation-chart.component.html',
  styleUrls: ['./province-evaluation-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProvinceEvaluationChartComponent {
  @Input() title = 'Distribuição por Província';
  @Input() subtitle = 'Comparativo entre Atendimento e Formação';
  @Input() icon = 'bar_chart';
  @Input() data: ProvinceEvaluationData[] = [];

  readonly svgWidth = 1100;
  readonly svgHeight = 360;
  private readonly baselineY = 320;
  private readonly chartHeight = 250;
  private readonly paddingX = 50;

  get hasData(): boolean {
    // Sempre mostrar o gráfico se houver províncias na lista (mesmo sem dados)
    return Array.isArray(this.data) && this.data.length > 0;
  }

  private get slotWidth(): number {
    const count = Math.max(this.data.length, 1);
    return (this.svgWidth - this.paddingX * 2) / count;
  }

  getBarWidth(): number {
    const width = this.slotWidth * 0.6;
    return Math.max(Math.min(width, 42), 18);
  }

  getBarX(index: number): number {
    const offset = (this.slotWidth - this.getBarWidth()) / 2;
    return this.paddingX + (index * this.slotWidth) + offset;
  }

  getLabelX(index: number): number {
    return this.paddingX + (index * this.slotWidth) + (this.slotWidth / 2);
  }

  getBarHeight(score?: number): number {
    const safeScore = Math.max(0, Math.min(100, score ?? 0));
    return (safeScore / 100) * this.chartHeight;
  }

  getBarY(score?: number): number {
    return this.baselineY - this.getBarHeight(score);
  }

  getValueLabelY(score?: number): number {
    return this.getBarY(score) - 8;
  }

  trackByName(_: number, item: ProvinceEvaluationData): string {
    return item.name;
  }
}

