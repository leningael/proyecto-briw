import { Component, OnInit, ViewChild } from '@angular/core';
import { DocumentsSearchService } from '../../services/documents-search.service';
import { DocumentResult, SpellSuggestion, Highlighting, Facet } from '../../interfaces/documents.interfaces';
import { DebounceInputComponent } from '../../components/debounce-input/debounce-input.component';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {
  @ViewChild('search') search!: DebounceInputComponent;
  documentsToSearch: string = '';
  documents: DocumentResult[] = [];
  highlighting!:Highlighting;
  suggestions: Array<[string, number]> = [];
  showSuggestions: boolean = false;
  spellSuggestions: SpellSuggestion[] = [];
  facets: Facet[] = [];
  filterBy: string = '';
  isLoading: boolean = false;
  notFound: boolean = false;
  constructor(private docsService:DocumentsSearchService) { }

  ngOnInit(): void {
  }

  getSuggestions(searchTerm: string){
    this.notFound = false;
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
    this.search.searchInput.setValue('');
    this.showSuggestions = false;
    this.spellSuggestions = [];
    this.facets = [];
    this.notFound = false;
    this.isLoading = true;
    this.documentsToSearch = searchTerm;
    this.docsService.searchDocuments(searchTerm, 'author').subscribe({
      next: ({facets, docs, highlighting}) => {
        this.documents = docs;
        this.highlighting = highlighting;
        this.facets = facets;
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

  filterFacet(facet: string){
    this.filterBy = facet;
  }
}
