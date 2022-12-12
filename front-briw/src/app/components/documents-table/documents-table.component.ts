import { Component, Input, OnInit } from '@angular/core';
import { DocumentResult } from 'src/app/interfaces/documents.interfaces';

@Component({
  selector: 'app-documents-table',
  templateUrl: './documents-table.component.html',
  styleUrls: ['./documents-table.component.css']
})
export class DocumentsTableComponent implements OnInit {
  @Input() documents: DocumentResult[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
