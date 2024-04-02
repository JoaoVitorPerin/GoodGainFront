import { environment } from './../../../../environments/environment';
import { LoadingService } from './../../../shared/components/loader-geral/loader-geral.service';
import { Observable } from 'rxjs';
import { HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, finalize } from 'rxjs/operators';

export const SKIP_LOADER = new HttpContextToken<boolean>(() => false);

@Injectable({
  providedIn: 'root'
})
export class LoaderService implements HttpInterceptor {

  private readonly API_BACK = `${environment.API_BACK}`;

  readonly urlsPermitidas = [];

  constructor(
    private loadingService: LoadingService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const skipLoader = request.context.get(SKIP_LOADER)

    if (!skipLoader) {
      this.loadingService.setLoading(true, request.url);
      return next.handle(request)?.pipe(
          finalize(() => {
            this.loadingService.setLoading(false, request.url);
          })
        )?.pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
          if (evt instanceof HttpResponse) {
            this.loadingService.setLoading(false, request.url);
          }
          return evt;
        }));
    }
    return next.handle(request);
  }

}
