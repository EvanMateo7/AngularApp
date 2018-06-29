import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from "@angular/http";
import { RouterModule, Routes } from "@angular/router";
import { environment } from "../environments/environment";
import { DataService } from './services/data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from "./core/core.module";

import { AngularFireModule, FirebaseApp } from "angularfire2";
export const firebaseConfig = environment.firebaseConfig;
import { AngularFirestoreModule } from "angularfire2/firestore";

import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppComponent } from './app.component';
import { UserComponent } from './components/user/user.component';
import { ItemComponent } from './components/item//item.component';
import { AboutComponent } from './components/about/about.component';


const appRoutes: Routes = [
  {path: '', component: ItemComponent},
  {path: 'users', component: UserComponent},
  {path: 'about', component: AboutComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    AboutComponent,
    ItemComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFontAwesomeModule,
    BrowserAnimationsModule,
    CoreModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
