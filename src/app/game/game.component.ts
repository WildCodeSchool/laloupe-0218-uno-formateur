import { Card } from 'models/card';
import { Room } from './../models/room';
import { AngularFirestore } from 'angularfire2/firestore';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  message = 'Waiting for opponent';
  roomId: string;
  username: string;
  room: Room;

  constructor(private route: ActivatedRoute, private db: AngularFirestore) { }

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('id');
    this.username = this.route.snapshot.paramMap.get('username');
    console.log(this.roomId, this.username);

    this.db.doc<Room>('rooms/' + this.roomId).valueChanges().subscribe(room => {
      this.room = room;
      if (room.players.length == 2) {
        this.message = 'Starting game';
        if (room.players[0].name == this.username && (!room.deck || room.deck.length == 0)) {
          this.distributeCards();
        }
      }
    });
  }

  distributeCards() {
    this.db.collection<Card>('cards').valueChanges().take(1).subscribe(deck => {
      this.shuffle(deck);
      let playerDecks = [[], []];
      let i = 1;
      while (i < 15) {
        playerDecks[i % 2].push(deck.pop());
        i++;
      }
      this.room.deck = deck;
      this.room.players[0].cards = playerDecks[0];
      this.room.players[1].cards = playerDecks[1];
      this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
    });
  }

  shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
  }

}
