import { Component, ChangeDetectorRef } from '@angular/core';
import { AuthService } from './core/auth.service';
import { User } from './models';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user$: Subscription;
  user: User;
  constructor(private auth: AuthService, private router: Router, private cd: ChangeDetectorRef) {}
  
  ngOnInit() {
    this.user$ = this.auth.user.subscribe(next => { 
      this.user = next;
      this.cd.detectChanges();
    });

    // Remove modal backdrop manually when change locations
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        Array.prototype.forEach.call(document.getElementsByClassName("modal-backdrop"), function(element: Element) {
          element.remove();
          console.log(element)
        });
      }
  });
  }

  ngOnDestroy() {
    this.user$.unsubscribe();
  }
}
