package at.jku.werewolf.io.lobbymanagement;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.io.Serializable;
@Entity
public class Player implements Serializable {

    @Id @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name="system-uuid", strategy = "uuid")
    String path;

    String name;


    public GameRole role;
    boolean dead=false;
    boolean isHost;
    int gotVotes;

    int countVoteForPlayer;

    public Player() {
    }
    public Player(String name) {
        this.name = name;
        this.gotVotes = 0;
    }

    public void resetVotes(){ this.gotVotes = 0;}

    public void addVote(){
        this.gotVotes++;
    }

    public int getVotes(){
        return this.gotVotes;
    }

    public boolean isHost() {
        return isHost;
    }

    public void setHost(boolean host) {
        isHost = host;
    }

    public boolean isDead() {
        return dead;
    }

    public void setDead(boolean dead) {
        this.dead = dead;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public GameRole getRole() {
        return role;
    }

    public void setRole(GameRole role) {
        this.role = role;
    }

    /*public int getCountVoteForPlayer() {
        return countVoteForPlayer;
    }

    public void setCountVoteForPlayer(int countVoteForPlayer) {
        this.countVoteForPlayer = countVoteForPlayer;
    }

     */
}
