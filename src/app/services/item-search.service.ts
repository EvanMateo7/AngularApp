import { Injectable } from '@angular/core';
import { Item } from '../models';
import algoliasearch from 'algoliasearch/lite';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { environment } from "../../environments/environment";
const AlgoliaConfig = environment.algolia;

@Injectable()
export class ItemSearchService {

  searchQuery: string = '';
  readonly results = new BehaviorSubject<Partial<Item>[]>([]);
  private algoliaIndex;
  private page: number = 0;
  pages: number[];
  numPages: number = 0;
  totalResults: number = 0;
  maxPerPage = 20;

  constructor(private afs: AngularFirestore) {
    this.initAlgolia();
  }

  private initAlgolia() {
    const algoliaClient = algoliasearch(AlgoliaConfig.appId, AlgoliaConfig.searchAPIKey);
    this.algoliaIndex = algoliaClient.initIndex(AlgoliaConfig.searchIndex);
  }

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

  async search(query: string, page: number = 0, numPerPage: number = this.maxPerPage): Promise<void> {
    this.searchQuery = query;
    let result;

    try {
      result = await this.algoliaIndex.search(query, {
        page: page,
        hitsPerPage: numPerPage
      });
      this.results.next(result.hits as Partial<Item>[]);
      this.currentPage = page;
      this.numPages = result.nbPages;
      this.totalResults = result.nbHits;
      this.setPages();
    } catch (error) {
      console.error("Failed to search Algolia", error)
      this.getItemsFromFirestore();
    }
  }

  getItemsFromFirestore() {
    const itemsCollection: AngularFirestoreCollection<Item> = 
      this.afs.collection("items", ref => ref.limit(this.maxPerPage));

    itemsCollection.get().toPromise()
      .then(querySnapshot => {
        let items: Item[] = querySnapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          }
        });
        this.results.next(items);
      })
      .catch(err => console.error(err));
  }
}
