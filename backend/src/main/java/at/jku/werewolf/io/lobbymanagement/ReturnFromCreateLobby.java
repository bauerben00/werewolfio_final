package at.jku.werewolf.io.lobbymanagement;

public class ReturnFromCreateLobby {
    String lobbycode;
    String userName;

    public ReturnFromCreateLobby(String lobbycode, String userName) {
        this.lobbycode = lobbycode;
        this.userName = userName;
    }

    public ReturnFromCreateLobby() {
    }

    public String getLobbycode() {
        return lobbycode;
    }

    public void setLobbycode(String lobbycode) {
        this.lobbycode = lobbycode;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
