import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Product } from 'src/app/models/product.model';
import { HistoricalData } from 'src/app/models/historical-data';

@Component({
  selector: 'app-product-detail-analytics',
  templateUrl: './product-detail-analytics.component.html',
  styleUrls: ['./product-detail-analytics.component.scss']
})
export class ProductDetailAnalyticsComponent implements AfterViewInit, OnChanges {

  @Input() product!: Product;
  @Input() historicalData: HistoricalData[] = [];

  @ViewChild('priceChart') chartRef!: ElementRef<HTMLCanvasElement>;
  private chart!: Chart;

  get primerPrecio(): number | null {
    return this.product?.precios?.[0]?.price ?? null;
  }

  ngAfterViewInit() {
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['historicalData'] && this.chart) {
      this.updateChartData();
    }
  }

  private initChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');

    this.chart = new Chart(ctx!, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Precio mínimo',
            data: this.historicalData.map(d => ({ x: d.date, y: d.bestPrice })),
            borderColor: 'green',
            backgroundColor: 'rgba(46,125,50,0.2)',
            fill: true,
            lineTension: 0.3
          },
          {
            label: 'Precio máximo',
            data: this.historicalData.map(d => ({ x: d.date, y: d.worstPrice })),
            borderColor: 'red',
            fill: false,
            lineTension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          mode: 'nearest',
          intersect: false,
          callbacks: {
            title: (tooltipItems: any[], data: any) => {
              const item = tooltipItems[0];
              if (!item) return '';

              const dsIndex = item.datasetIndex;
              const idx = item.index;
              const point = data?.datasets?.[dsIndex]?.data?.[idx];

              // punto.x puede ser Date o timestamp o string; lo normal será Date si aplicaste el cambio
              const xVal = point?.x ?? item?.xLabel ?? item?.label ?? null;
              if (!xVal) return '';

              const date = (typeof xVal === 'number') ? new Date(xVal) : new Date(xVal);
              if (isNaN(date.getTime())) return '';

              return new Intl.DateTimeFormat('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              }).format(date);
            },
            label: (tooltipItem: any) => {
              const yValue = tooltipItem?.yLabel ?? tooltipItem?.value ?? null;
              if (yValue == null) return '';
              return new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2
              }).format(yValue);
            }
          }
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: { unit: 'month', displayFormats: { month: 'MMM yy' } },
            scaleLabel: { display: true, labelString: 'Fecha' }
          }],
          yAxes: [{
            scaleLabel: { display: true, labelString: 'Precio (€)' }
          }]
        },
        legend: { display: false }
      }
    });
  }

  private updateChartData() {
    if (!this.chart || !this.chart.data || !this.chart.data.datasets?.length) {
      return;
    }

    this.chart.data.datasets[0].data = this.historicalData.map(d => ({
      x: d.date.getTime(),
      y: d.bestPrice
    }));

    this.chart.data.datasets[1].data = this.historicalData.map(d => ({
      x: d.date.getTime(),
      y: d.worstPrice
    }));

    this.chart.update();
  }

}

