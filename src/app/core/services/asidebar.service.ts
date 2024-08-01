import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsidebarService {
  private triggerHistoricoSource = new Subject<void>();
  triggerHistorico$ = this.triggerHistoricoSource.asObservable();

  triggerHistorico() {
    this.triggerHistoricoSource.next();
  }
}
