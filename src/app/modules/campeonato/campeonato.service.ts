import { HttpClient, HttpContext, HttpContextToken, HttpParams } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from "rxjs";
import { HeaderService } from "src/app/core/services/header.service";
import { environment } from "src/environments/environment";
import { SKIP_LOADER } from "src/app/core/interceptors/loader/loader.service";
@Injectable({
  providedIn: 'root'
})
export class CampeonatoService {

    private readonly API_BACK = `${environment.API_BACK}`;
    SKIP_LOADER = SKIP_LOADER;
    data: any;

    constructor(private http: HttpClient, private headerService: HeaderService) { }

    getAllCampeonatos(): Observable<any> {
        return this.http.get<any>(this.API_BACK + 'campeonato', {
          headers: this.headerService.getHeader(),
          params: {all_campeonatos: true}
        });
    }

    alterarStatusCampeonato(id: any): Observable<any> {
        return this.http.post<any>(this.API_BACK + 'campeonato', {campeonato_id: id}, {
          headers: this.headerService.getHeader(),
        });
    }
}
