import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/firestore";
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators';
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';

import { Roles, User } from '../../models';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  currentUser: User;

  usersCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;
  userDoc: AngularFirestoreDocument<User>;

  selectedUser: User;
  newUser: User;

  roles: string[];

  faEdit = faEdit;
  faTimes = faTimes;

  constructor(public auth: AuthService, private afs: AngularFirestore) { };

  ngOnInit() {
    console.log('Initialize: UserComponent...');

    this.auth.user.subscribe(next => {
      this.currentUser = next;
    });

    const userDataObject = _ => {
      const data = _.payload.doc.data() as User;
      data.id = _.payload.doc.id;
      return data;
    }

    this.usersCollection = this.afs.collection("users");
    this.users = this.usersCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(userDataObject);
    })
    );

    this.selectedUser = null;
    this.newUser = null;

    this.roles = Object.values(Roles);
  }

  roleChange(role, checked): void {
    if (!this.selectedUser.roles) {
      this.selectedUser.roles = [];
    }

    if (checked && !this.selectedUser.roles.includes(role)) {
      this.selectedUser.roles = [...this.selectedUser.roles, role];
    }
    else {
      this.selectedUser.roles = this.selectedUser.roles.filter(r => r != role);
    }
  }

  selectUser(user): void {
    this.selectedUser = user;
    this.newUser = null;
  }

  updateUser(): void {
    console.log("updating user...");
    this.userDoc = this.afs.doc(`users/${this.selectedUser.id}`);
    this.userDoc.update(this.selectedUser);
  }

  deleteUser(user): void {
    console.log("deleting user...");
    this.userDoc = this.afs.doc(`users/${user.id}`);
    this.userDoc.delete();
  }
}
