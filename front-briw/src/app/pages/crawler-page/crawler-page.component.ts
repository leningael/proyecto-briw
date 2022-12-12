import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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
  constructor(private formBuilder:FormBuilder, private docsService:DocumentsSearchService, private toastr:ToastrService) { }

  ngOnInit(): void {
  }

  uploadDoc(){
    this.isSaving = true;
    this.docsService.indexPage(this.crawlerForm.value.url!).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastr.success('Page indexed successfully', 'Success');
        this.crawlerForm.reset();
      },
      error: (err) => {
        this.isSaving = false;
        this.toastr.error('There was an error indexing the page', 'Error');
      }
    });
  }

}
