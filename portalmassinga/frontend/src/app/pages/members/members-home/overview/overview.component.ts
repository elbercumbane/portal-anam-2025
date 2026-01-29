import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class OverviewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('memberContributionsChart', { static: false }) memberContributionsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('associationGrowthChart', { static: false }) associationGrowthChartRef!: ElementRef<HTMLCanvasElement>;
  
  @Input() memberContributions: any;
  @Input() associationSummary: any;
  
  memberContributionsChart: Chart | null = null;
  associationGrowthChart: Chart | null = null;

  memberContributionsData = {
    labels: ['Jul 2024', 'Ago 2024', 'Set 2024', 'Out 2024', 'Nov 2024', 'Dez 2024'],
    values: [1500, 2000, 1800, 2200, 2500, 1500]
  };

  growthChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    values: [120, 125, 130, 135, 140, 145, 150, 155, 160, 170, 175, 187]
  };

  ngOnInit(): void {
    // Inicialização se necessário
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMemberContributionsChart();
      this.initAssociationGrowthChart();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.memberContributionsChart) {
      this.memberContributionsChart.destroy();
    }
    if (this.associationGrowthChart) {
      this.associationGrowthChart.destroy();
    }
  }

  initMemberContributionsChart(): void {
    if (!this.memberContributionsChartRef?.nativeElement) return;

    const ctx = this.memberContributionsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.memberContributionsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.memberContributionsData.labels,
        datasets: [{
          label: 'Contribuições (MTn)',
          data: this.memberContributionsData.values,
          backgroundColor: 'rgba(16, 185, 129, 0.6)',
          borderColor: '#10B981',
          borderWidth: 2,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.parsed.y ?? 0;
                return 'Valor: ' + value.toLocaleString('pt-MZ') + ' MTn';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value.toLocaleString('pt-MZ') + ' MTn';
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  initAssociationGrowthChart(): void {
    if (!this.associationGrowthChartRef?.nativeElement) return;

    const ctx = this.associationGrowthChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.associationGrowthChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.growthChartData.labels,
        datasets: [{
          label: 'Número de Membros',
          data: this.growthChartData.values,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: '#10B981',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.parsed.y ?? 0;
                return 'Membros: ' + value;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              stepSize: 10
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
}

