import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

import * as firebase from "firebase/app";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore, AngularFirestoreDocument } from "angularfire2/firestore";

import { Observable } from 'rxjs';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { User } from '../models';


@Injectable()
export class AuthService {

  user: Observable<User>;

  constructor(private afAuth: AngularFireAuth, 
              private afs: AngularFirestore, 
              private router: Router) { 

    this.user = this.afAuth.authState.switchMap(user => {
      if(user) {
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
      }
      else {
        return Observable.of(null);
      }
    })
  }
  
  private updateUserData(credentiallUser) {
    console.log("Updating user data after login...");
    
    
    const userDoc = this.afs.doc(`users/${credentiallUser.uid}`);
    const user: User = {
      id: credentiallUser.uid, 
      email: credentiallUser.email,
      displayName: credentiallUser.displayName,
      photoURL: credentiallUser.photoURL,
    }
    userDoc.update(user)
      .catch(err => {
        console.error(`User: ${credentiallUser.displayName} does not exist`);
        this.createUser(user);
      });
  }
    
  private createUser(newUser) {
    console.log("Creating User...");
    const newUserDoc = this.afs.collection("users").doc(newUser.id);
    newUserDoc.set(newUser);
  }
  

  private oAuthLogin(provider) {
    console.log("oAuthLogin");
    return this.afAuth.auth.signInWithPopup(provider)
      .then( credential => {
        // TODO: Initial User Data in Firestore /users
        console.log("User logged in.");
        this.updateUserData(credential.user);
      })
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  
}
