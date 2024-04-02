import { Subject } from 'rxjs';
import { Injectable, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  isPrinting = false;

  private templateImpressao = new Subject<TemplateRef<any>>();
  templateImpressao$ = this.templateImpressao.asObservable();

  ultimaAtualizacao: any;

  constructor(private router: Router) {
    this.templateImpressao$.subscribe(template => {
      this.ultimaAtualizacao = template;
    });
  }

  atualizarTemplateImpressao(template: TemplateRef<any>) {
    this.templateImpressao.next(template);
    this.isPrinting = true;
    this.router.navigate(['/',
      {
        outlets: {
          'print': ['print', 'invoice']
        }
      }]);

  }
  onDataReady() {
    setTimeout(() => {
      window.print();
      this.isPrinting = false;
      this.router.navigate([{ outlets: { print: null } }]);
    });
  }
}
