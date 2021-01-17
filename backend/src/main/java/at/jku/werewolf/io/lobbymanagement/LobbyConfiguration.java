package at.jku.werewolf.io.lobbymanagement;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;


public class LobbyConfiguration {

 int werewolves;
 int votingtime;
 int discussiontime;

    public LobbyConfiguration() {
    }

    public LobbyConfiguration(int werewolves, int votingtime, int discussiontime) {
        this.werewolves = werewolves;
        this.votingtime = votingtime;
        this.discussiontime = discussiontime;
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
}
