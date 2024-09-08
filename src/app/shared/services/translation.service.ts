import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private url = 'https://api.mymemory.translated.net/get'; // URL da API

  constructor(private http: HttpClient) { }

  translateText(text: string, targetLanguage: string = 'pt'): Observable<any> {
    const params = {
      q: text,
      langpair: `en|${targetLanguage}`
    };

    return this.http.get(this.url, { params });
  }
}
