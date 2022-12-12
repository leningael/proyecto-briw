import { Component, OnInit } from '@angular/core';
import { DocumentsSearchService } from '../../services/documents-search.service';
import { DocumentResult, SpellSuggestion } from '../../interfaces/documents.interfaces';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {
  documentsToSearch: string = '';
  documents: DocumentResult[] = [];
  suggestions: Array<[string, number]> = [];
  showSuggestions: boolean = false;
  spellSuggestions: SpellSuggestion[] = [];
  isLoading: boolean = false;
  notFound: boolean = false;
  constructor(private docsService:DocumentsSearchService) { }

  ngOnInit(): void {
  }

  getSuggestions(searchTerm: string){
    if(this.documentsToSearch === searchTerm) return;
    this.documentsToSearch = searchTerm;
    (searchTerm) ? this.showSuggestions = true : this.showSuggestions = false;
    this.docsService.getSuggestions(searchTerm).subscribe({
      next: (suggestions) => {
        this.suggestions = suggestions.keywords.splice(0, 5);
      },
      error: (err) => {
        this.suggestions = [];
      }
    });
  }

  searchDocuments(searchTerm: string){
    if(!searchTerm) return;
    this.showSuggestions = false;
    this.spellSuggestions = [];
    this.notFound = false;
    this.isLoading = true;
    this.documentsToSearch = searchTerm;
    this.docsService.searchDocuments(searchTerm).subscribe({
      next: (documents) => {
        this.documents = documents;
        this.isLoading = false;
      },
      error: (err) => {
        this.documents = [];
        this.notFound = true;
        (err.status === 404) ? this.getSpellSuggestion(searchTerm) : this.isLoading = false;
      }
    });
  }

  getSpellSuggestion(searchTerm: string){
    this.docsService.spellCheck(searchTerm).subscribe({
      next: (result) => {
        if(result.suggestions){
          this.spellSuggestions = result.suggestions[1].suggestion.splice(0, 4);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.spellSuggestions = [];
        this.isLoading = false;
      }
    });
  }
}
