import { Component, ChangeDetectorRef } from '@angular/core';
import { AuthService } from './core/auth.service';
import { User } from './models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user$: Subscription;
  user: User;
  constructor(private auth: AuthService, private cd: ChangeDetectorRef) {}
  
  ngOnInit() {
    this.user$ = this.auth.user.subscribe(next => { 
      this.user = next;
      this.cd.detectChanges();
    });
  }

  ngOnDestroy() {
    this.user$.unsubscribe();
  }
}
