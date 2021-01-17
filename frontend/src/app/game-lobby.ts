import {Player} from './player';

export class GameLobby {
  constructor(public werewolves: number, public votingtime: number, public discussiontime: number, public players: Player[]) {
  }
}
