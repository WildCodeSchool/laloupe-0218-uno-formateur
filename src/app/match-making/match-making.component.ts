import { AuthService } from './../auth.service';
import { Player } from './../models/player';
import { Room } from './../models/room';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-match-making',
  templateUrl: './match-making.component.html',
  styleUrls: ['./match-making.component.css'],
})
export class MatchMakingComponent implements OnInit {

  private authSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private db: AngularFirestore,
    private router: Router) { }

  ngOnInit() {
    this.authSubscription = this.authService.authState.take(1).subscribe((user) => {
      if (user) {
        this.getRooms();
      }
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  getRooms() {
    const roomsCollection = this.db.collection<Room>('rooms');

    const snapshot = roomsCollection.snapshotChanges().take(1).subscribe((snapshot) => {
      const player = new Player();
      player.name = this.authService.name;
      player.cards = [];

      for (const snapshotItem of snapshot) {
        const roomId = snapshotItem.payload.doc.id;
        const room = snapshotItem.payload.doc.data() as Room;

        if (Object.keys(room.players).length === 1) {
          room.players[this.authService.authId] = player;
          this.db.doc('rooms/' + roomId).update(JSON.parse(JSON.stringify(room)));
          this.router.navigate(['game', roomId]);
          return;
        }
      }

      const room = new Room();
      room.players = {};
      room.players[this.authService.authId] = player;
      this.db.collection('rooms')
        .add(JSON.parse(JSON.stringify(room)))
        .then((doc) => {
          this.router.navigate(['game', doc.id]);
        });
    });
  }
}
