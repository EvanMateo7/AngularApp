import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators';

import { Item } from '../models';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit{

  itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  itemDoc: AngularFirestoreDocument<Item>;

  selectedItem: Item;
  newItem: Item;

  constructor(private afs: AngularFirestore) { 
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
    this.newItem = {name: "", description: "", price: 0};
    this.selectedItem = null;
  }
  


  updateItem(): void {
    console.log("updating item...");
    this.itemDoc = this.afs.doc(`items/${this.selectedItem.id}`);
    this.itemDoc.update(this.selectedItem);
  }

  deleteItem(item): void {
    console.log("deleting item...");
    this.itemDoc = this.afs.doc(`items/${item.id}`);
    this.itemDoc.delete();
  }

  addItem(): void {
    console.log("adding item...");
    this.itemsCollection.add(this.newItem);
  }
}