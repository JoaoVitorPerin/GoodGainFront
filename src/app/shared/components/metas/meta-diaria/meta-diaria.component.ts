import { Component, Input, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-meta-diaria',
  templateUrl: './meta-diaria.component.html',
  styleUrls: ['./meta-diaria.component.css'],
  imports: [
    ChartModule,
    CardModule
  ],
  standalone: true
})
export class MetaDiariaComponent implements OnInit {

  @Input() dadosMetasDiaria: number[]

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
            weight: 'bold'  // Deixa os ticks em negrito
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
      labels: ['1', '2','3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
      showLine: false,
      datasets: [
        {
          type: 'line',
          label: 'Realizado Diário',
          pointRadius: 6,
          tension: 0.4,
          backgroundColor: '#7dca84',
          data: [9, 8, 11, 12, 10, 11, 12, 10, 9, 8, 9, 8, 11, 12, 10, 11, 12, 10, 9, 8, 9, 8, 11, 12, 10, 11, 12, 10, 9, 8],
          borderColor: '#fff',
        },
        {
          type: 'bar',
          label: 'Meta Diária',
          backgroundColor: '#7dca84',
          data: [9, 8, 11, 12, 10, 11, 12, 10, 9, 8, 9, 8, 11, 12, 10, 11, 12, 10, 9, 8, 9, 8, 11, 12, 10, 11, 12, 10, 9, 8],
        },
      ]
    };

    
  }

}
