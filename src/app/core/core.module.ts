import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularFireModule, FirebaseApp } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { environment } from "../../environments/environment";
export const firebaseConfig = environment.firebaseConfig;
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AuthService } from './auth.service';

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFontAwesomeModule,
  ],
  exports: [
    CommonModule,
    AngularFireModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFontAwesomeModule,
  ],
  providers: [
    AuthService
  ],
  declarations: []
})
export class CoreModule { }
