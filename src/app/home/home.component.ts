import { Card } from '../models/card';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  constructor(private db: AngularFirestore, private router: Router) {

  }

  ngOnInit() {
    this.checkCards();
  }

  checkCards() {
    const cardsCollection = this.db.collection('cards');
    cardsCollection.valueChanges().take(1).subscribe((cards) => {
      console.log(cards.length);
      if (cards.length === 0) {
        this.generateCards();
      } else {
        console.log('Cards collection already exists');
      }
      this.router.navigate(['matchmaking']);
    });
  }

  generateCards() {
    const cardsCollection = this.db.collection<Card>('cards');
    const colors = ['red', 'yellow', 'green', 'blue'];

    for (const color of colors) {
      let i = 1;
      while (i < 10) {
        const card = new Card();
        card.color = color;
        card.value = i;
        cardsCollection.add(JSON.parse(JSON.stringify(card)));
        i += 1;
      }
    }
  }
}
