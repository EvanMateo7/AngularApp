import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, CollectionReference, DocumentSnapshot } from '@angular/fire/firestore';
import firebase from 'firebase/app';

@Component({
  selector: 'app-like-dislike',
  templateUrl: './like-dislike.component.html',
  styleUrls: ['./like-dislike.component.css']
})
export class LikeDislikeComponent implements OnInit {
  @Input() docId: string;
  @Input() isInteractive: boolean = true;

  likeDislikeCollection: AngularFirestoreCollection;
  likeDislikeDoc: AngularFirestoreDocument<any>;
  likeDislike: any;

  constructor(private afs: AngularFirestore) { }

  ngOnInit(): void {
    this.likeDislikeCollection = this.afs.collection("like_dislike");
    this.likeDislikeDoc = this.likeDislikeCollection.doc(this.docId);
    this.likeDislikeDoc.get().toPromise().then((doc: DocumentSnapshot<any>) => {
      this.likeDislike = doc.data() ?? {};
    })
  }

  update(event: Event, like: boolean) {
    if (this.likeDislike) {
      const property = like ? "like" : "dislike";
      const data = { [property]: firebase.firestore.FieldValue.increment(1) }
      this.likeDislikeCollection.doc(this.docId).update(data)
        .catch((error) => {
          this.likeDislikeCollection.doc(this.docId).set(data);
        });;
      event.stopPropagation();
    }
  }

}
