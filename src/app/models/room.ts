import { Card } from './card';
import { Player } from './player';

export class Room {
  deck: Card[];
  graveyard: Card[];
  players: {};
  turn: string;
  winner: string;
}
