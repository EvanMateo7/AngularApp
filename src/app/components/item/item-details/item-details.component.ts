import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { User, Item, ItemComment } from '../../../models';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentData, DocumentChange } from "angularfire2/firestore";
import { Observable, Subscription } from 'rxjs'
import { map } from 'rxjs/operators';

import * as firebase from "firebase/app";


@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
  @ViewChild('commentForm') commentForm;

  selectedItem: Observable<Item> = null;
  itemDoc: AngularFirestoreDocument<Item>;
  comment: ItemComment = {userId: "", comment: "", timestamp: null};
  commentsCollection: AngularFirestoreCollection;
  comments: DocumentData[];
  currentUser: User;
  currentUserSubscription: Subscription;
  maxLinesValid: boolean = true;
  
  constructor(private auth: AuthService, private route: ActivatedRoute, private afs: AngularFirestore) { }

  ngOnInit() {
    console.log("Initialize: ItemDetailsComponent...");
    
    this.getItemDoc(); 
    this.currentUserSubscription = this.auth.user.subscribe(user => {
      if(user)
      {
        this.currentUser = user;
        this.comment.userId = this.auth.getCurrentUser().uid;
        console.log("User:" + this.auth.getCurrentUser().uid);
      }
    })
    this.commentsCollection = this.itemDoc.collection("comments");
    this.getComments();
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
  }

  getItemDoc(): void {
    const itemId = this.route.snapshot.paramMap.get("itemId");
    this.itemDoc = this.afs.doc(`items/${itemId}`);
    this.selectedItem = this.itemDoc.valueChanges();
  }

  getComments(): void {
    this.commentsCollection.ref.orderBy("timestamp").get().then(querySnapshot => {
      this.comments = querySnapshot.docs.map(doc => doc.data());
    });
  }

  addComment() {
    let str = this.comment.comment;
    let count = (str.match(/\r|\n/g) || []).length;
    if(count > 20)
      this.maxLinesValid = false;
    else
      this.maxLinesValid = true;
    
    if(this.currentUser && this.maxLinesValid)
    {
      console.log("adding comment...");
      this.comment.id = this.currentUser.id;
      this.comment.timestamp = Date.now();
      this.commentsCollection.add(this.comment);
      this.commentForm.resetForm();
    }

    this.getComments();
  }

}
