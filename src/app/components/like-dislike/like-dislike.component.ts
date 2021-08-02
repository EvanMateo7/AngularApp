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

  userLikeDislikeDoc: AngularFirestoreDocument<any>;
  userLikeDislikeData: any = {};

  likeDislikeDoc: AngularFirestoreDocument<any>;
  likeDislikeData: any = { likes: 0, dislikes: 0 };

  constructor(public auth: AuthService, private afs: AngularFirestore) { }

  ngOnInit(): void {
    const likeDislikeCollection = this.afs.collection('items');
    this.likeDislikeDoc = likeDislikeCollection.doc(this.docId);
    this.likeDislikeDoc.get().toPromise().then((doc: DocumentSnapshot<any>) => {
      if (doc.data() != undefined) {
        const itemLikesDislikes = (({ likes = 0, dislikes = 0 }) => ({ likes, dislikes }))(doc.data());
        this.likeDislikeData = itemLikesDislikes;
      }
    })

    const userLikeDislikeCollection = this.afs.collection(`users/${this.auth.currentUser.id}/user_like_dislike`);
    this.userLikeDislikeDoc = userLikeDislikeCollection.doc(this.docId);
    this.userLikeDislikeDoc.get().toPromise().then((doc: DocumentSnapshot<any>) => {
      if (doc.data() != undefined) {
        this.userLikeDislikeData = doc.data();
      }
    })
  }

  update(event: Event, like: boolean) {
    event.stopPropagation();

    this.afs.firestore.runTransaction(async (transaction) => {
      return transaction.get(this.userLikeDislikeDoc.ref).then((doc) => {
        if (doc.data() != undefined) {
          this.userLikeDislikeData = doc.data();
        }

        // Update like_dislike of item
        const existingUserRating = this.userLikeDislikeData.like_dislike || 0;
        const likeOrDislike = like ? "likes" : "dislikes";
        const likeOrDislikeOther = like ? "dislikes" : "likes";
        let likeDislikeUpdate = {
          [likeOrDislike]: firebase.firestore.FieldValue.increment(1),
        };
        let alreadyLikedOrDisliked = like && existingUserRating > 0 || !like && existingUserRating < 0;
        let alreadyLikedOrDislikedOther = like && existingUserRating < 0 || !like && existingUserRating > 0;

        if (alreadyLikedOrDisliked) {
          likeDislikeUpdate = {
            [likeOrDislike]: firebase.firestore.FieldValue.increment(-1),
          };
          this.likeDislikeData[likeOrDislike] -= 1;
        }
        else if (alreadyLikedOrDislikedOther) {
          likeDislikeUpdate = {
            ...likeDislikeUpdate,
            [likeOrDislikeOther]: firebase.firestore.FieldValue.increment(-1),
          }
          this.likeDislikeData[likeOrDislike] += 1;
          this.likeDislikeData[likeOrDislikeOther] -= 1;
        }
        else {
          this.likeDislikeData[likeOrDislike] += 1;
        }
        transaction.set(this.likeDislikeDoc.ref, likeDislikeUpdate, { merge: true });

        // Update like_dislike of user
        this.userLikeDislikeData = { like_dislike: 0 }
        if (!alreadyLikedOrDisliked) {
          this.userLikeDislikeData = { like_dislike: like ? 1 : -1 };
        }
        transaction.set(this.userLikeDislikeDoc.ref, this.userLikeDislikeData);
      });
    });
  }

  get liked() {
    return this.userLikeDislikeData?.like_dislike > 0;
  }

  get disliked() {
    return this.userLikeDislikeData?.like_dislike < 0;
  }

  get likeDislikeRatio() {
    return (this.likeDislikeData.likes / (this.likeDislikeData.likes + this.likeDislikeData.dislikes)) * 100 || 0;
  }
}
