import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from "@angular/router";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from "./core/core.module";

import { AppComponent } from './app.component';
import { UserTableComponent } from './components/userTable/userTable.component';
import { ItemComponent } from './components/item//item.component';
import { ItemDetailsComponent } from './components/item/item-details/item-details.component';
import { AuthGuard } from './core/auth.guard';
import { MaxLineValidatorDirective } from './validators/max-line-validator.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Roles } from './models';
import { LikeDislikeComponent } from './components/like-dislike/like-dislike.component';
import { ItemListComponent } from './components/item/item-list/item-list.component';


const appRoutes: Routes = [
  { path: 'images', component: ItemComponent },
  { path: 'users', component: UserTableComponent, canActivate: [AuthGuard], data: { role: Roles.ADMIN } },
  { path: '**', redirectTo: '/images', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    UserTableComponent,
    ItemComponent,
    ItemDetailsComponent,
    MaxLineValidatorDirective,
    LikeDislikeComponent,
    ItemListComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' }),
    BrowserAnimationsModule,
    CoreModule.forRoot(),
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
