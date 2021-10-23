import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './core/auth.service';
import { User } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user$: Subscription;
  user: User;
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.user$ = this.auth.user.subscribe(next => {
      this.user = next;
    }); 
    // Remove modal backdrop manually when changing locations
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        Array.prototype.forEach.call(document.getElementsByClassName("modal-backdrop"), (element: Element) => {
          element.remove();
        });
      }
    });
  }

  ngOnDestroy() {
    this.user$.unsubscribe();
  }
}
