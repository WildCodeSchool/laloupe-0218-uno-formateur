import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { Card } from './models/card';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  constructor(private db: AngularFirestore, private router: Router) {

  }


  ngOnInit() {
    this.checkCards();
  }

  goToHome() {
    this.router.navigate(['home']);
  }

  checkCards() {
    const cardsCollection = this.db.collection('cards');
    cardsCollection.valueChanges().take(1).subscribe((cards) => {
      if (cards.length === 0) {
        this.generateCards();
      }
    });
  }

  generateCards() {
    const cardsCollection = this.db.collection<Card>('cards');
    const colors = ['red', 'yellow', 'green', 'blue'];

    for (const color of colors) {
      let i = 0;
      while (i < 10) {
        const card = new Card();
        card.color = color;
        card.value = i;
        cardsCollection.add(JSON.parse(JSON.stringify(card)));
        i += 1;
      }
      i = 1;
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
