import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/firestore";
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs'
import firebase from 'firebase/app';

import { Item } from '../../models';
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ItemSearchService } from '../../services/item-search.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  providers: [ItemSearchService]
})
export class ItemComponent implements OnInit {

  @ViewChild('itemImageInput') itemImageInput;
  @ViewChild('addItemForm') addItemForm;

  itemsCollection: AngularFirestoreCollection<Item>;
  items: Partial<Item>[];
  itemDoc: AngularFirestoreDocument<Item>;

  selectedItem: Item;
  newItem: Item;

  uploadPercent: Observable<number>;
  uploadImage: any;

  faEdit = faEdit;
  faTimes = faTimes;

  constructor(
    public auth: AuthService, 
    private afs: AngularFirestore, 
    private storage: AngularFireStorage,
    public algoliaItemSeach: ItemSearchService
  ) { }

  ngOnInit() {
    console.log('Initialize: ItemComponent...');

    const itemDataObject = _ => {
      const data = _.payload.doc.data() as Item;
      data.id = _.payload.doc.id;
      return data;
    }

    this.itemsCollection = this.afs.collection("items");

    this.itemsCollection.get().toPromise()
      .then(querySnapshot => {
        this.items = querySnapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          }
        });
      })
      .catch(err => console.error(err));

    this.algoliaItemSeach.results.subscribe((next) => {
      this.items = next;
    })

    this.selectedItem = null;
    this.newItem = null;
  }

  get currentPage(): number {
    return this.algoliaItemSeach.currentPage;
  }

  get pages(): number[] {
    return this.algoliaItemSeach.pages;
  }

  get numPages(): number {
    return this.algoliaItemSeach.numPages;
  }

  get isFirstPage(): boolean {
    return this.algoliaItemSeach.isFirstPage;
  }

  get isLastPage(): boolean {
    return this.algoliaItemSeach.isLastPage;
  }
  
  prevPage(): void {
    this.algoliaItemSeach.prevPage();
  }

  setPage(page: number): void {
    this.algoliaItemSeach.setPage(page);
  }

  nextPage(): void {
    this.algoliaItemSeach.nextPage();
  }

  getItemDate(item: Partial<Item>): Date {
    if (typeof item.dateCreated === 'number') {
      return new Date(item.dateCreated);
    }
    else if (typeof item.dateCreated.toDate === 'function') {
      return item.dateCreated.toDate();
    }
  }

  async searchItem(query: string) {
    await this.algoliaItemSeach.search(query);
  }

  selectItem(event: Event, item: Item): void {
    this.selectedItem = item;
    this.newItem = null;
  }

  addNewItem() {
    if (this.auth.currentUser) {
      this.newItem = { 
        id: "",
        userID: this.auth.currentUser.id,
        name: "",
        description: "",
        dateCreated: firebase.firestore.FieldValue.serverTimestamp()
      };
    }
    this.selectedItem = null;
  }

  updateItem(): void {
    if (this.auth.currentUser) {
      console.log("updating item...");
      this.itemDoc = this.afs.doc(`items/${this.selectedItem.id}`);
      this.itemDoc.update(this.selectedItem);
    }
  }

  deleteItem(item: Item): void {
    if (this.auth.currentUser) {
      console.log("deleting item...");
      this.itemDoc = this.afs.doc(`items/${item.id}`);
      this.itemDoc.delete();
    }
  }

  async addItem() {
    console.log("adding item...");
    const newItemRef = this.itemsCollection.doc();
    this.newItem.id = newItemRef.ref.id;
    await newItemRef.set(this.newItem);
    this.uploadFile(this.newItem.id);
  }

  resetAddItemForm(): void {
    this.addItemForm.resetForm();
    this.itemImageInput.nativeElement.value = "";
    console.log("addItemForm reset.");
  }

  getUploadFile(event): void {
    this.uploadImage = event.target.files[0];
  }

  uploadFile(itemID: String): void {

    const filePath = `images/${itemID}`;
    if (this.uploadImage != undefined) {
      console.log("uploading file...");
      const uploadRef = this.storage.ref(filePath);
      const uploadTask = uploadRef.put(this.uploadImage);
      this.uploadPercent = uploadTask.percentageChanges();
      uploadTask.then(_ => this.resetAddItemForm());
      // uploadTask.snapshotChanges().pipe(
      //   finalize(() => {
      //     let url = uploadRef.getDownloadURL().subscribe( next => {
      //       this.itemDoc = this.afs.doc(`items/${itemID}`);
      //       this.itemDoc.update({imageURL: next});
      //     });
      //   } )
      // ).subscribe();
    }
    else {
      console.error("upload image is UNDEFINED!");
    }
  }

}
