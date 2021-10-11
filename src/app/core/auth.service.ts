import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

import firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";

import { Observable, of } from 'rxjs';
import { switchMap } from "rxjs/operators";
import { Roles, User } from '../models';


@Injectable()
export class AuthService {

  currentUser: User;
  user: Observable<User>;

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router) {
    this.user = this.afAuth.authState.pipe(switchMap(user => {
      if (user) {
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
      }
      else {
        return of(null);
      }
    })
    );

    this.user.subscribe(next => {
      this.currentUser = next;
    });
  }

  private updateUserData(credentiallUser): void {
    const userDoc = this.afs.doc(`users/${credentiallUser.uid}`);
    const existingUser: User = {
      id: credentiallUser.uid,
      email: credentiallUser.email,
      photoURL: credentiallUser.photoURL,
    }
    const newUser: User = {
      id: credentiallUser.uid,
      email: credentiallUser.email,
      displayName: credentiallUser.displayName,
      photoURL: credentiallUser.photoURL,
    }
    userDoc.update(existingUser)
      .then(_ => {
        console.log('user data updated.');
      })
      .catch(err => {
        console.error(`User: ${credentiallUser.displayName} does not exist in user collection!`);
        this.createUser(newUser);
      });
  }

  private createUser(newUser): void {
    console.log("creating User...");
    const newUserDoc = this.afs.collection("users").doc(newUser.id);
    newUserDoc.set(newUser);
  }


  private oAuthLogin(provider): Promise<any> {
    return this.afAuth.signInWithPopup(provider)
      .then(credential => {
        console.log("user logged in.");
        this.updateUserData(credential.user);
      })
  }

  public googleLogin(): Promise<any> {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    return this.oAuthLogin(provider);
  }

  public get isAdmin(): boolean {
    return !!this.currentUser.roles?.includes(Roles.ADMIN);
  }

  public logout(): void {
    this.afAuth.signOut()
      .then(function () {
        console.log("user logged out.");
      })
      .catch(function (error) {
        console.error("Error logging out!");
      });
  }

}
