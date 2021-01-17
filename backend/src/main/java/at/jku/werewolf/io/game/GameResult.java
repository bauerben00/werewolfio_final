package at.jku.werewolf.io.game;

import at.jku.werewolf.io.lobbymanagement.GameRole;

public class GameResult {
    boolean isOver;
    GameRole hasWon;

    public GameResult(boolean isOver, GameRole hasWon) {
        this.isOver = isOver;
        this.hasWon = hasWon;
    }

    public GameResult(boolean isOver) {
        this.isOver = isOver;
    }
}
