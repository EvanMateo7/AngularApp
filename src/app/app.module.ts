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
import { DataService } from './services/data.service';
import { ItemDetailsComponent } from './components/item/item-details/item-details.component';
import { AuthGuard } from './core/auth.guard';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { MaxLineValidatorDirective } from './validators/max-line-validator.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Roles } from './models';
import { LikeDislikeComponent } from './components/like-dislike/like-dislike.component';
import { ItemListComponent } from './components/item/item-list/item-list.component';


const appRoutes: Routes = [
  {path: '', redirectTo: '/item', pathMatch: 'full'},
  {path: 'item', component: ItemComponent},
  {path: 'users', component: UserComponent, canActivate: [AuthGuard], data: {role: Roles.ADMIN}},
  {path: 'profile', component: UserProfileComponent},
  {path: '**', component: ItemComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    ItemComponent,
    ItemDetailsComponent,
    UserProfileComponent,
    MaxLineValidatorDirective,
    LikeDislikeComponent,
    ItemListComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' }),
    BrowserAnimationsModule,
    CoreModule.forRoot(),
    FontAwesomeModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
