import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DocumentResult, SpellCheckResponse, SuggestionsResponse, UploadResult } from '../interfaces/documents.interfaces';

@Injectable({
  providedIn: 'root'
})
export class DocumentsSearchService {
  apiUrl: string = environment.apiUrl;
  constructor(private http:HttpClient) { }

  getSuggestions(searchTerm: string): Observable<SuggestionsResponse>{
    const params = new HttpParams().set('query', searchTerm);
    return this.http.get<SuggestionsResponse>(`${this.apiUrl}/suggest`, {params});
  }

  searchDocuments(searchTerm: string, facet?: string): Observable<DocumentResult[]>{
    let params = new HttpParams().set('query', searchTerm);
    if(facet) params = params.append('facet', facet);
    return this.http.get<DocumentResult[]>(`${this.apiUrl}/search`, {params});
  }

  indexPage(url: string):Observable<UploadResult>{
    let params = new HttpParams().set('url', url);
    return this.http.get<UploadResult>(`${this.apiUrl}/extract_html`, {params});
  }

  spellCheck(searchTerm: string):Observable<SpellCheckResponse>{
    let params = new HttpParams().set('query', searchTerm);
    return this.http.get<SpellCheckResponse>(`${this.apiUrl}/spellcheck`, {params});
  }
}
