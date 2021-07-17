import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Component({
  selector: 'app-like-dislike',
  templateUrl: './like-dislike.component.html',
  styleUrls: ['./like-dislike.component.css']
})
export class LikeDislikeComponent implements OnInit {
  @Input() firestoreDoc: AngularFirestoreDocument;
  @Input() firestoreDir: string;

  @Input() likes: number;
  @Input() dislikes: number;

  doc: any;

  constructor(private afs: AngularFirestore) { }

  ngOnInit(): void {
    if (this.firestoreDoc) {
      this.doc = this.firestoreDoc.get().toPromise().then(doc => {
        this.doc = doc.data();
      })
    }
  }

  like(event: Event) {
    if (this.doc) {
      console.log("liking...");
      this.firestoreDoc.update({likes: (this.doc?.likes || 0) + 1});
      event.stopPropagation();
    }
  }

  dislike(event: Event) {
    if (this.doc) {
      console.log("disliking...");
      this.firestoreDoc.update({dislikes: (this.doc?.dislikes || 0) + 1});
      event.stopPropagation();
    }
  }

}
