import { Component, Input, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-meta-mensal',
  templateUrl: './meta-mensal.component.html',
  styleUrls: ['./meta-mensal.component.css'],
  imports: [
    ChartModule,
    CardModule
  ],
  standalone: true
})
export class MetaMensalComponent implements OnInit {

  @Input() dadosMetasMensal: number[]

  data: any;

  options = {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#fff',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          drawBorder: false,
          display: false
        }
      },
      y: {
        ticks: {
          display: false
        },
        grid: {
          drawBorder: false,
          display: false
        }
      }
    }
  };

  constructor() { }

  ngOnInit() {
    this.initChart()
  }

  initChart(): void {
    this.data = {
      labels: ['1', '2','3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      showLine: false,
      datasets: [
        {
          type: 'line',
          label: 'Realizado Diário',
          pointRadius: 6,
          tension: .4,
          backgroundColor: '#fac553',
          data: [9, 8, 11, 12, 10, 11, 12, 10, 9, 8, 9, 8],
          borderColor: '#fff',
        },
        {
          type: 'bar',
          label: 'Meta Diária',
          backgroundColor: '#fac553',
          data: [9, 8, 11, 12, 10, 11, 12, 10, 9, 8, 9, 8],
        },
      ]
    };
  }

}
