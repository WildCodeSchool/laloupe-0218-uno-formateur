import { Card } from '../models/card';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/take';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  constructor(private db: AngularFirestore,
    private router: Router, public afAuth: AngularFireAuth) {

  }

  ngOnInit() {
    // this.router.navigate(['matchmaking']);
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

}
