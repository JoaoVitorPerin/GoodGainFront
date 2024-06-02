import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TokenService } from 'src/app/core/services/token.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ChartModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  nomeUser: any;

  dataCampeonatos: any;
  basicOptions: any;
  tipoAposta: any;

  constructor(
    private tokenService: TokenService
  ){}

  ngOnInit() {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      this.dataCampeonatos = {
          labels: ['Campeonato'],
          datasets: [
            {
              label: 'Premier League',
              data: [56],
              backgroundColor: [documentStyle.getPropertyValue('--purple-500')],
              borderColor: [documentStyle.getPropertyValue('--purple-500')],
              borderWidth: 1
            },
            {
                label: 'Campeonato Brasileiro',
                data: [34],
                backgroundColor: [documentStyle.getPropertyValue('--blue-500')],
                borderColor: [documentStyle.getPropertyValue('--blue-500')],
                borderWidth: 1
            },
            {
              label: 'Copa do Brasil',
              data: [12],
              backgroundColor: [documentStyle.getPropertyValue('--green-500')],
              borderColor: [documentStyle.getPropertyValue('--green-500')],
              borderWidth: 1
            },
          ]
      };

      this.tipoAposta = {
        labels: ['Tipo de Aposta'],
        datasets: [
          {
            label: '+8.5 escanteios',
            data: [65],
            backgroundColor: [documentStyle.getPropertyValue('--purple-500')],
            borderColor: [documentStyle.getPropertyValue('--purple-500')],
            borderWidth: 1
          },
          {
            label: 'Ambos marcam',
            data: [49],
            backgroundColor: [documentStyle.getPropertyValue('--blue-500')],
            borderColor: [documentStyle.getPropertyValue('--blue-500')],
            borderWidth: 1
          },
          {
            label: '+1.5 cartões amarelos',
            data: [43],
            backgroundColor: [documentStyle.getPropertyValue('--green-500')],
            borderColor: [documentStyle.getPropertyValue('--green-500')],
            borderWidth: 1
          },
          {
            label: '+2.5 gols',
            data: [32],
            backgroundColor: [documentStyle.getPropertyValue('--yellow-500')],
            borderColor: [documentStyle.getPropertyValue('--yellow-500')],
            borderWidth: 1
          },
          {
            label: '+1.5 cartões vermelhos',
            data: [21],
            backgroundColor: [documentStyle.getPropertyValue('--orange-500')],
            borderColor: [documentStyle.getPropertyValue('--orange-500')],
            borderWidth: 1
          },
          {
            label: 'Vencedor',
            data: [12],
            backgroundColor: [documentStyle.getPropertyValue('--red-500')],
            borderColor: [documentStyle.getPropertyValue('--red-500')],
            borderWidth: 1
          },
        ]
    };

      this.basicOptions = {
          plugins: {
              legend: {
                  labels: {
                      color: textColor
                  }
              }
          },
          scales: {
              y: {
                  beginAtZero: true,
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              },
              x: {
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              }
          }
      };

      this.buscarInfosPerfil();
  }

  buscarInfosPerfil(){
    this.nomeUser = `${this.tokenService.getJwtDecoded().cli_info.nome} ${this.tokenService.getJwtDecoded().cli_info.sobrenome}`;
  }
}
