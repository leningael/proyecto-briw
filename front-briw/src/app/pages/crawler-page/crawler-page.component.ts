import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DocumentsSearchService } from '../../services/documents-search.service';

@Component({
  selector: 'app-crawler-page',
  templateUrl: './crawler-page.component.html',
  styleUrls: ['./crawler-page.component.css']
})
export class CrawlerPageComponent implements OnInit {
  crawlerForm = this.formBuilder.group({
    url: ['', Validators.required],
  });
  isSaving: boolean = false;
  constructor(private formBuilder:FormBuilder, private docsService:DocumentsSearchService) { }

  ngOnInit(): void {
  }

  uploadDoc(){
    this.isSaving = true;
    this.docsService.indexPage(this.crawlerForm.value.url!).subscribe({
      next: () => {
        this.isSaving = false;
        this.crawlerForm.reset();
      },
      error: (err) => {
        this.isSaving = false;
      }
    });
  }

}
