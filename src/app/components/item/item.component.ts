import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs'
import { map, finalize } from 'rxjs/operators';

import { Item } from '../../models';
import { VariableAst } from '../../../../node_modules/@angular/compiler';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  @ViewChild('itemImageInput') itemImageInput;
  @ViewChild('addItemForm') addItemForm;

  itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  itemDoc: AngularFirestoreDocument<Item>;

  selectedItem: Item;
  newItem: Item;

  uploadPercent: Observable<number>;
  uploadImage: any;


  constructor(private auth: AuthService, private afs: AngularFirestore, private storage: AngularFireStorage) { 
    console.log('Constructing: ItemComponent with AngularFirestore...');
  }

  ngOnInit() {
    console.log('Initialize: ItemComponent...');

    const itemDataObject = _ => {
      const data = _.payload.doc.data() as Item;
      data.id = _.payload.doc.id;
      return data;
    }

    this.itemsCollection = this.afs.collection("items");
    this.items = this.itemsCollection.snapshotChanges().pipe(map(changes => {
        return changes.map(itemDataObject);
      })
    );

    this.selectedItem = null;
    this.newItem = null;
  }


  selectItem(item): void {
    this.selectedItem = item;
    this.newItem = null;
  }

  addNewItem(): void {
    const currentUser = this.auth.getCurrentUser();
    if(currentUser) {
      this.newItem = {userId: currentUser.uid, name: "", description: "", price: 0};
    }
    this.selectedItem = null;
  }
  
  updateItem(): void {
    const currentUser = this.auth.getCurrentUser();
    if(currentUser) {
      console.log("updating item...");
      this.itemDoc = this.afs.doc(`items/${this.selectedItem.id}`);
      this.itemDoc.update(this.selectedItem);
    }
  }

  deleteItem(item: Item): void {
    const currentUser = this.auth.getCurrentUser();
    if(currentUser) {
      console.log("deleting item...");
      this.itemDoc = this.afs.doc(`items/${item.id}`);
      this.itemDoc.delete();
    }
  }

  async addItem() {
    console.log("adding item...");
    let newItem = await this.itemsCollection.add(this.newItem);
    console.log(newItem.id);
    this.uploadFile(newItem.id);
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
    if(this.uploadImage != undefined) {
      console.log("uploading file...");
      const uploadRef = this.storage.ref(filePath);
      const uploadTask = uploadRef.put(this.uploadImage);
      this.uploadPercent = uploadTask.percentageChanges();

      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          let url = uploadRef.getDownloadURL().subscribe( next => {
            this.itemDoc = this.afs.doc(`items/${itemID}`);
            this.itemDoc.update({imageURL: next});
          });
        } )
      ).subscribe();
    }
    else {
      console.error("upload image is UNDEFINED!");
    }
      
  }
}