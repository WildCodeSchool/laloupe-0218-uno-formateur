import { AuthService } from './../auth.service';
import { Card } from '../models/card';
import { Room } from '../models/room';
import { AngularFirestore } from 'angularfire2/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  message = 'Waiting for opponent';
  roomId: string;
  room: Room;

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private db: AngularFirestore) { }

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('id');

    this.db
      .doc<Room>('rooms/' + this.roomId)
      .valueChanges()
      .subscribe((room) => {
        this.room = room;
        if (Object.keys(room.players).length === 2 && !this.room.winner) {
          if (
            Object.keys(room.players)[0] === this.myId &&
            (!room.deck || room.deck.length === 0)
          ) {
            this.message = 'Distributing cards, please wait';
            this.distributeCards();
          } else if (room.deck) {
            this.message = 'Starting game';
          }
        } else if (this.room.winner) {
          if (this.room.winner === this.myId) {
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
      .subscribe((deck) => {
        this.shuffleArray(deck);
        const playerDecks = [[], []];
        let i = 1;
        while (i < 15) {
          playerDecks[i % 2].push(deck.pop());
          i += 1;
        }
        this.room.deck = deck;
        this.room.turn = this.opponentId;
        this.putCard(this.room.deck.pop());
        this.firstPlayer.cards = playerDecks[0];
        this.secondPlayer.cards = playerDecks[1];
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
    if (!this.canIPlay(this.me.cards[index])) {
      return;
    }
    const card = this.me.cards.splice(index, 1)[0];
    this.putCard(card);
    this.endTurn();
  }

  updateRoom() {
    this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
  }

  endTurn() {
    if (this.getCards(this.myId).length === 0) {
      this.room.winner = this.myId;
    }
    this.changeTurn();
    this.updateRoom();
  }

  drawCard() {
    const newCard = this.room.deck.pop();
    this.me.cards.push(newCard);
    this.updateRoom();
    if (this.canIPlay(newCard)) {
      this.playCard(this.me.cards.length - 1);
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
    this.room.turn = this.room.turn === this.myId ? this.opponentId : this.myId;
  }

  get me() {
    return this.room.players[this.myId];
  }

  get opponent() {
    return this.room.players[this.opponentId];
  }

  get myId(): string {
    return this.authService.authId;
  }

  get opponentId(): string {
    if (Object.keys(this.room.players)[0] === this.myId) {
      return Object.keys(this.room.players)[1];
    }
    return Object.keys(this.room.players)[0];
  }

  get firstPlayer() {
    return this.room.players[Object.keys(this.room.players)[0]];
  }

  get secondPlayer() {
    return this.room.players[(Object.keys(this.room.players)[1])];
  }

  isMyTurn(): boolean {
    return this.myId === this.room.turn;
  }

  // uno() {}
  // againstUno() {}

  isUno(): boolean {
    if (
      this.firstPlayer.cards.length === 1 ||
      this.secondPlayer.cards.length === 1
    ) {
      return true;
    }
    return false;
  }

  newGame() { }

  isReady(): boolean {
    return this.room && this.room.turn && !this.room.winner
      ? true
      : false;
  }

  getLastPlayed(): Card {
    if (this.room && this.room.graveyard) {
      return this.room.graveyard[this.room.graveyard.length - 1];
    }
    return new Card();
  }

  getCardClasses(card: Card): string[] {
    return ['num-' + card.value, card.color];
  }

  getCards(index): Card[] {
    return this.room.players[index].cards;
  }

  shuffleArray(arr) {
    let j;
    let x;
    let i;
    for (i = arr.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      x = arr[i];
      arr[i] = arr[j];
      arr[j] = x;
    }
  }
}
