package at.jku.werewolf.io.lobbymanagement;

import at.jku.werewolf.io.game.GameResult;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Entity
public class GameLobby implements Serializable {
    public boolean gameRunning = true;
    int werewolves;
    int votingtime;
    int discussiontime;

    @OneToMany (cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Player> players = new ArrayList<Player>();



    @Id @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name="system-uuid", strategy = "uuid")
    String lobbycode;

    public GameLobby(LobbyConfiguration configuration) {
      werewolves=configuration.werewolves;
      votingtime=configuration.votingtime;
      discussiontime=configuration.discussiontime;
    }

    public GameLobby() {
    }

    public String listWerewolves(){
        String result = "";
        for(Player p : players){
            if(p.getRole().equals(GameRole.WEREWOLF)){
                result += p.getPath()+ "|";
            }
        }
        return result;
    }

    public int countAllAlive(GameRole gameRole){
        int count = 0;
        for (int i = 0; i < players.size(); i++){
            if(players.get(i).getRole().equals(gameRole) && !players.get(i).isDead() ){
                count++;
            }
        }
        return count;
    }

    public int getWerewolves() {
        return werewolves;
    }

    public void setWerewolves(int werewolves) {
        this.werewolves = werewolves;
    }

    public int getVotingtime() {
        return votingtime;
    }

    public void setVotingtime(int votingtime) {
        this.votingtime = votingtime;
    }

    public int getDiscussiontime() {
        return discussiontime;
    }

    public void setDiscussiontime(int discussiontime) {
        this.discussiontime = discussiontime;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public void setPlayers(List<Player> players) {
        this.players = players;
    }

    public String getLobbycode() {
        return lobbycode;
    }

    public void setLobbycode(String lobbycode) {
        this.lobbycode = lobbycode;
    }

    public boolean isGameRunning() {
        return gameRunning;
    }

    public void setGameRunning(boolean gameRunning) {
        this.gameRunning = gameRunning;
    }
}
