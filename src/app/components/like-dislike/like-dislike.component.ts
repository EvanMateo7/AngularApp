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
  likeDislike: any = {like: 0, dislike: 0};

  constructor(private afs: AngularFirestore) { }

  ngOnInit(): void {
    this.likeDislikeCollection = this.afs.collection("like_dislike");
    this.likeDislikeDoc = this.likeDislikeCollection.doc(this.docId);
    this.likeDislikeDoc.get().toPromise().then((doc: DocumentSnapshot<any>) => {
      if (doc.data() != undefined) {
        this.likeDislike = doc.data();
      }
    })
  }

  update(event: Event, like: boolean) {
    const property = like ? "like" : "dislike";
    const data = { [property]: firebase.firestore.FieldValue.increment(1) }
    this.likeDislikeCollection.doc(this.docId).update(data)
      .catch((error) => {
        const firstLikeDislike = Object.assign(data, this.likeDislike);
        console.log(firstLikeDislike)
        this.likeDislikeCollection.doc(this.docId).set(firstLikeDislike);
      });
    
      this.likeDislike[property] += 1;
    event.stopPropagation();
  }

  get likeDislikeRatio() {
    return (this.likeDislike.like / (this.likeDislike.like + this.likeDislike.dislike)) * 100 || 0;

  }

}
