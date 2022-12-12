import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { CrawlerPageComponent } from './pages/crawler-page/crawler-page.component';

const routes: Routes = [
  { path: '', component: SearchPageComponent, pathMatch: 'full' },
  { path: 'crawler', component: CrawlerPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
