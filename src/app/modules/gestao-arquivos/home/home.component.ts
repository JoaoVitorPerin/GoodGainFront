import { Component, OnInit } from '@angular/core';
import { GestorArquivosService } from 'src/app/shared/components/gestor-arquivos/gestor-arquivos.service';
import { HomeService } from './home.service';

@Component({
  selector: 'app-arquivos-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  constructor(
    private homeService: HomeService,
    private arquivosService: GestorArquivosService
  ) {
  }

  ngOnInit(): void {
    this.buscarRoot();
  }

  buscarRoot(): void {
    this.homeService.buscarRoot().subscribe(res => {
      if (res.status)
        this.arquivosService.setRoot(res.root);
    });
  }
}
