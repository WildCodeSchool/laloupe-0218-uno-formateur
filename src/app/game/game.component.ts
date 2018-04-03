import { Card } from '../models/card';
import { Room } from '../models/room';
import { AngularFirestore } from 'angularfire2/firestore';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  message = 'Waiting for opponent';
  roomId: string;
  username: string;
  room: Room;
  myPlayerId: number;

  constructor(private route: ActivatedRoute, private db: AngularFirestore) { }

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('id');
    this.username = this.route.snapshot.paramMap.get('username');

    this.db
      .doc<Room>('rooms/' + this.roomId)
      .valueChanges()
      .subscribe(room => {
        this.room = room;
        this.myPlayerId = room.players[0].name === this.username ? 0 : 1;
        if (room.players.length === 2 && this.room.winner === undefined) {
          this.message = 'Starting game';
          if (
            room.players[0].name === this.username &&
            (!room.deck || room.deck.length === 0)
          ) {
            this.distributeCards();
          }
        } else if (this.room.winner !== undefined) {
          if (this.room.winner === this.myPlayerId) {
            this.message = 'You win !!!';
          } else {
            this.message = 'You loose !!!';
          }
        }
      });
  }

  distributeCards() {
    this.db
      .collection<Card>('cards')
      .valueChanges()
      .take(1)
      .subscribe(deck => {
        this.shuffle(deck);
        const playerDecks = [[], []];
        let i = 1;
        while (i < 15) {
          playerDecks[i % 2].push(deck.pop());
          i += 1;
        }
        this.room.deck = deck;
        this.room.turn = 1;
        this.putCard(this.room.deck.pop());
        this.room.players[0].cards = playerDecks[0];
        this.room.players[1].cards = playerDecks[1];
        this.updateRoom();
      });
  }

  putCard(card: Card) {
    if (!this.room.graveyard) {
      this.room.graveyard = [card];
    } else {
      this.room.graveyard.push(card);
    }
    this.updateRoom();
  }

  playCard(index) {
    if (!this.canIPlay(this.getMe().cards[index])) {
      return;
    }
    const card = this.getMe().cards.splice(index, 1)[0];
    this.putCard(card);
    this.endTurn();
  }

  updateRoom() {
    this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
  }

  endTurn() {
    if (this.getCards(this.myPlayerId).length === 0) {
      this.room.winner = this.myPlayerId;
    }
    this.changeTurn();
    this.updateRoom();
  }

  drawCard() {
    const newCard = this.room.deck.pop();
    this.getMe().cards.push(newCard);
    this.updateRoom();
    if (this.canIPlay(newCard)) {
      this.playCard(this.getMe().cards.length - 1);
    } else {
      this.endTurn();
    }
  }

  canIPlay(card: Card): boolean {
    if (
      this.isMyTurn() &&
      (card.value === this.getLastPlayed().value ||
        card.color === this.getLastPlayed().color)
    ) {
      return true;
    }
    return false;
  }

  changeTurn() {
    this.room.turn = this.room.turn === 0 ? 1 : 0;
  }

  getMe() {
    return this.room.players[this.myPlayerId];
  }

  isMyTurn(): boolean {
    return this.myPlayerId === this.room.turn;
    // return this.room.players[this.room.turn].name == this.username;
  }

  // uno() {}
  // againstUno() {}

  isUno(): boolean {
    if (
      this.room.players[0].cards.length === 1 ||
      this.room.players[1].cards.length === 1
    ) {
      return true;
    }
    return false;
  }

  newGame() { }

  isReady(): boolean {
    return this.room &&
      this.room.turn !== undefined &&
      this.room.winner === undefined
      ? true
      : false;
  }

  getLastPlayed(): Card {
    if (this.room && this.room.graveyard) {
      return this.room.graveyard[this.room.graveyard.length - 1];
    } else {
      return new Card();
    }
  }

  getCardClasses(card: Card): string[] {
    return ['num-' + card.value, card.color];
  }

  getCards(index): Card[] {
    return this.room.players[index].cards;
  }

  shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
  }
}
