import { Pipe, PipeTransform } from '@angular/core';
import { DocumentResult } from '../interfaces/documents.interfaces';

@Pipe({
  name: 'filterFacet'
})
export class FilterFacetPipe implements PipeTransform {

  transform(documents: DocumentResult[], facet: string = ''): DocumentResult[] {
    return (facet) ? documents.filter(doc => doc.author && doc.author[0].toLowerCase().includes(facet.toLowerCase())) : documents;
  }

}
