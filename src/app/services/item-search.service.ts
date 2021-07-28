import { Injectable } from '@angular/core';
import { Item } from '../models';
import algoliasearch from 'algoliasearch/lite';
import { BehaviorSubject } from 'rxjs';

const algoliaClient = algoliasearch('WN5Z9RJLKU', 'fb68ffed3f270354488a2b97d830234a');
const algoliaIndex = algoliaClient.initIndex('angularapp_dev');

@Injectable()
export class ItemSearchService {

  searchQuery: string = '';
  readonly results = new BehaviorSubject<Partial<Item>[]>([]);
  private page: number = 0;
  pages: number[];
  numPages: number = 0;
  totalResults: number = 0;

  constructor() { }

  get currentPage() {
    return this.page;
  }

  set currentPage(num: number) {
    if (this.page === num) {
      return;
    }
    if (num >= 0 && num < this.numPages) {
      this.page = num;
      this.search(this.searchQuery, this.page);
    }
  }

  get isFirstPage(): boolean {
    return this.page === 0;
  }

  get isLastPage(): boolean {
    return this.page === this.numPages - 1;
  }

  prevPage(): void {
    this.currentPage -= 1;
  }

  nextPage(): void {
    this.currentPage += 1;
  }

  setPage(page: number): void {
    this.currentPage = page;
  }

  setPages(): void {
    this.pages = Array.from(Array(this.numPages).keys());
  }

  async search(query: string, page: number = 0, numPerPage: number = 2): Promise<void> {
    this.searchQuery = query;
    const result = await algoliaIndex.search(query, {
      page: page,
      hitsPerPage: numPerPage
    });

    this.results.next(result.hits as Partial<Item>[]);
    this.currentPage = page;
    this.numPages = result.nbPages;
    this.totalResults = result.nbHits;
    this.setPages();
  }

}
