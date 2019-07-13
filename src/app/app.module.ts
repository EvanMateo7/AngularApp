import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from "@angular/http";
import { RouterModule, Routes } from "@angular/router";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from "./core/core.module";

import { AppComponent } from './app.component';
import { UserComponent } from './components/user/user.component';
import { ItemComponent } from './components/item//item.component';
import { AboutComponent } from './components/about/about.component';
import { DataService } from './services/data.service';
import { ItemDetailsComponent } from './components/item/item-details/item-details.component';
import { AuthGuard } from './core/auth.guard';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';


const appRoutes: Routes = [
  {path: '', redirectTo: '/item', pathMatch: 'full'},
  {path: 'item', component: ItemComponent},
  {path: 'item/:itemId', component: ItemDetailsComponent},
  {path: 'users', component: UserComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: UserProfileComponent},
  {path: 'about', component: AboutComponent},
  {path: '**', component: AboutComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    AboutComponent,
    ItemComponent,
    ItemDetailsComponent,
    UserProfileComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    CoreModule.forRoot()
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
