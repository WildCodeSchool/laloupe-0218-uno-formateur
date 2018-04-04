import { AuthService } from './../auth.service';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {

  private authSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authSubscription = this.authService.authState.subscribe((user) => {
      if (user) {
        this.router.navigate(['matchmaking']);
      }
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

}
