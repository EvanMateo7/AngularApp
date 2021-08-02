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
  itemsPerPage: number = 20;

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
    public itemSearchService: ItemSearchService
  ) { }

  ngOnInit() {
    console.log('Initialize: ItemComponent...');

    this.itemsCollection = this.afs.collection("items");

    this.itemSearchService.results.subscribe((next) => {
      this.items = next;
    });
    this.searchItem('');

    this.selectedItem = null;
    this.newItem = null;
  }

  get currentPage(): number {
    return this.itemSearchService.currentPage;
  }

  get pages(): number[] {
    return this.itemSearchService.pages;
  }

  get numPages(): number {
    return this.itemSearchService.numPages;
  }

  get isFirstPage(): boolean {
    return this.itemSearchService.isFirstPage;
  }

  get isLastPage(): boolean {
    return this.itemSearchService.isLastPage;
  }

  prevPage(): void {
    this.itemSearchService.prevPage();
  }

  setPage(page: number): void {
    this.itemSearchService.setPage(page);
  }

  nextPage(): void {
    this.itemSearchService.nextPage();
  }

  async searchItem(query: string) {
    this.items = null;
    await this.itemSearchService.search(query, 0, this.itemsPerPage);
  }

  selectItem(itemID: string): void {
    this.selectedItem = null;
    this.itemDoc = this.afs.doc(`items/${itemID}`);
    this.itemDoc.ref.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        this.selectedItem = docSnapshot.data();
      }
    });
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
