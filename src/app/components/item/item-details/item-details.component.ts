import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { User, Item, ItemComment } from '../../../models';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentData, DocumentChange, DocumentSnapshot } from "@angular/fire/firestore";
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
  comments: DocumentData[] = [];
  lastCommentTimestamp: any;
  currentUser: User;
  currentUserSubscription: Subscription;
  noComments: boolean;
  noMoreComments: boolean;
  
  constructor(private auth: AuthService, private route: ActivatedRoute, private afs: AngularFirestore) { }

  ngOnInit() {
    console.log("Initialize: ItemDetailsComponent...");
    
    this.getItemDoc(); 
    this.currentUserSubscription = this.auth.user.subscribe(user => {
      if(user)
      {
        this.currentUser = user;
        this.comment.userId = user.id;
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
    this.commentsCollection.ref.orderBy("timestamp", "desc").limit(5).get().then(querySnapshot => {
      this.comments = querySnapshot.docs.map(doc => doc.data());
      if(this.comments.length > 0) {
        this.lastCommentTimestamp = this.comments[this.comments.length-1].timestamp;
        this.noComments = false;
      }    
      else {
        console.log("No comments");
        this.noComments = true;
      }
    });
  }

  getMoreComments(): void {
    this.commentsCollection.ref.orderBy("timestamp", "desc").startAfter(this.lastCommentTimestamp).limit(5).get().then(querySnapshot => {
      let moreComments = querySnapshot.docs.map(doc => doc.data());
      if(moreComments.length > 0) {
        this.comments = this.comments.concat(moreComments);
        this.lastCommentTimestamp = this.comments[this.comments.length-1].timestamp;
        this.noMoreComments = false;
      }   
      else {
        console.log("No more comments");
        this.noMoreComments = true;
      }
    });
  }

  addComment() {
    if(this.currentUser)
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
