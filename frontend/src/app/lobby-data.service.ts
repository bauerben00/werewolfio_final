import {Injectable} from '@angular/core';
import {GameLobby} from './game-lobby';
import {Player} from "./player";


@Injectable({
  providedIn: 'root'
})
export class LobbyDataService {

  game: GameLobby;
  //bin ich werwolf
  isWerewolf: boolean;
  // die paths der spieler die werwolf sind
  werewolvesPaths: String[];
  codeGame: string;
  playername: string;

  constructor() {
  }
  isPlayerWerewolf(p: Player) {
    for (var str of this.werewolvesPaths) {
      if (str.toLowerCase() == p.path.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

}
