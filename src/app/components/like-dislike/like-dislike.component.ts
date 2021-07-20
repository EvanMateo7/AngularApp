import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentSnapshot } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-like-dislike',
  templateUrl: './like-dislike.component.html',
  styleUrls: ['./like-dislike.component.css']
})
export class LikeDislikeComponent implements OnInit {
  @Input() docId: string;
  @Input() isInteractive: boolean = true;

  likeDislikeUserDoc: AngularFirestoreDocument<any>;
  likeDislikeDoc: AngularFirestoreDocument<any>;
  likeDislikeData: any = { like: 0, dislike: 0 };
  likeDislikeUser: any = {};

  constructor(public auth: AuthService, private afs: AngularFirestore) { }

  ngOnInit(): void {
    const likeDislikeCollection = this.afs.collection("like_dislike");
    this.likeDislikeDoc = likeDislikeCollection.doc(this.docId);
    this.likeDislikeDoc.get().toPromise().then((doc: DocumentSnapshot<any>) => {
      if (doc.data() != undefined) {
        this.likeDislikeData = doc.data();
      }
    })

    const likeDislikeUserCollection = this.afs.collection(`like_dislike/${this.docId}/users`);
    this.likeDislikeUserDoc = likeDislikeUserCollection.doc(this.auth.currentUser.id);
    this.likeDislikeUserDoc.get().toPromise().then((doc: DocumentSnapshot<any>) => {
      if (doc.data() != undefined) {
        this.likeDislikeUser = doc.data();
      }
    })
  }

  update(event: Event, like: boolean) {
    const likeOrDislike = like ? "like" : "dislike";
    const likeOrDislikeOther = like ? "dislike" : "like";

    this.afs.firestore.runTransaction(async (transaction) => {
      return transaction.get(this.likeDislikeUserDoc.ref).then((doc) => {
        if (doc.data() != undefined) {
          this.likeDislikeUser = doc.data();
        }

        // Update like_dislike in firestore
        const incOrDec = likeOrDislike in this.likeDislikeUser ? -1 : 1;
        let likeDislikeUpdate = { [likeOrDislike]: firebase.firestore.FieldValue.increment(incOrDec) };

        if (likeOrDislikeOther in this.likeDislikeUser) {
          likeDislikeUpdate = {
            ...likeDislikeUpdate,
            [likeOrDislikeOther]: firebase.firestore.FieldValue.increment(-1),
          };
        }
        transaction.set(this.likeDislikeDoc.ref, likeDislikeUpdate, {merge: true});
        
        // Update locals
        this.likeDislikeData[likeOrDislike] += incOrDec;
        if (likeOrDislikeOther in this.likeDislikeUser) {
          this.likeDislikeData[likeOrDislikeOther] -= 1;
        }
        this.likeDislikeUser = incOrDec < 0 ? {} : { [likeOrDislike]: 1 };

        // Update like_dislike user in firestore
        transaction.set(this.likeDislikeUserDoc.ref, this.likeDislikeUser);
      });
    });

    event.stopPropagation();
  }

  get likeDislikeRatio() {
    return (this.likeDislikeData.like / (this.likeDislikeData.like + this.likeDislikeData.dislike)) * 100 || 0;
  }
}
