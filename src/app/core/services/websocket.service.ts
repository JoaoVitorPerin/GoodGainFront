import { TokenService } from 'src/app/core/services/token.service';
import { environment } from './../../../environments/environment';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  readonly CHAT_URL = environment.API_WS + "ws/alerta/";
  public messages: Subject<string>;

  private msgs = new Subject<any>()
  messages$: Observable<any>

  ws: WebSocket;

  error = false;

  constructor(private tokenService: TokenService) {
    this.messages$ = this.msgs.asObservable();
    this.connect();
  }

  private connect(): void {

    if (!environment.WEBSOCKET_ATIVO) {
      return
    }

    const url = this.CHAT_URL + this.tokenService.getJwtDecodedAccess()['matricula']

    this.ws = new WebSocket(url);
    this.ws.onmessage = (msg) => {
      this.atualizarMensagens(msg)
    };
    this.ws.onerror = () => {
      this.error = true;
    }
    this.ws.onclose = () => {
      if(!this.error){
        this.connect();
      }
    }
    this.ws.close.bind(this.ws);
  }

  atualizarMensagens(msg: any) {
    this.msgs.next(msg);
  }
}
