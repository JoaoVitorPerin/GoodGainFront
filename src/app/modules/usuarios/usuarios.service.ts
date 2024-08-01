import { HttpClient, HttpContext, HttpContextToken, HttpParams } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from "rxjs";
import { HeaderService } from "src/app/core/services/header.service";
import { environment } from "src/environments/environment";
import { SKIP_LOADER } from "src/app/core/interceptors/loader/loader.service";
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

    private readonly API_BACK = `${environment.API_BACK}`;
    SKIP_LOADER = SKIP_LOADER;
    data: any;

    constructor(private http: HttpClient, private headerService: HeaderService) { }
}
