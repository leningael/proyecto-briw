import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { CrawlerPageComponent } from './pages/crawler-page/crawler-page.component';
import { DebounceInputComponent } from './components/debounce-input/debounce-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DocumentsTableComponent } from './components/documents-table/documents-table.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchPageComponent,
    SidebarComponent,
    CrawlerPageComponent,
    DebounceInputComponent,
    DocumentsTableComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
