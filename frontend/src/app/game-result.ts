import {GameRole} from "./game-role.enum";

export class GameResult {
  constructor(public isOver: boolean, public winner: GameRole) {
  }
}
