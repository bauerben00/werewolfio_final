package at.jku.werewolf.io.game;

import at.jku.werewolf.io.lobbymanagement.GameLobby;
import at.jku.werewolf.io.lobbymanagement.GameRole;
import at.jku.werewolf.io.lobbymanagement.LobbyRepository;
import at.jku.werewolf.io.lobbymanagement.Player;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;

@Controller
public class VotingController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    LobbyRepository repo;
    int countVotes;

    public VotingController(SimpMessagingTemplate simpMessagingTemplate, LobbyRepository repo) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.repo = repo;
        countVotes = 0;
    }

    @Transactional()
    @MessageMapping("/playervote/{lobbycode}")
    @SendTo("/topic/playervote")
    public String countPlayerVote (String player, @DestinationVariable String lobbycode) {
        System.out.println("countPlayerVote()");

        return votePlayer(player, lobbycode, false);
    }

    @Transactional()
    @MessageMapping("/werewolfvote/{lobbycode}")
    @SendTo("/topic/werewolfvote")
    public String countWerewolfVote (String player, @DestinationVariable String lobbycode) {
        System.out.println("countWerewolfVote()");

        return votePlayer(player, lobbycode, true);
    }


    public String votePlayer(String player, String lobbycode, boolean onlyWerewolves){
        System.out.println("votePlayer()" + player + lobbycode);
        GameLobby lobby = repo.findById(lobbycode).get();

        JSONParser parser = new JSONParser();
        try {
            JSONObject json = (JSONObject) parser.parse(player);
            String pathPlayer = json.get("path").toString();

            lobby.getPlayers().stream().filter(a-> a.getPath().equals(pathPlayer)).forEach(a -> a.addVote());
            //Speichern
            repo.saveAndFlush(lobby);
            //Überprüfung ob alle gevoted haben

            int possibleVoters = 0;
            int sumOfVotes = 0;

            sumOfVotes = lobby.getPlayers().stream().mapToInt(o -> o.getVotes()).sum();

            if(onlyWerewolves){
                possibleVoters = Math.toIntExact(lobby.getPlayers().stream().filter(a-> a.role== GameRole.WEREWOLF).filter(a -> a.isDead() == false).count());
            }
            else {
                possibleVoters = Math.toIntExact(lobby.getPlayers().stream().filter(a -> a.isDead() == false).count());
            }

            if(!onlyWerewolves){
                if(sumOfVotes == possibleVoters){
                    CalculateResults.calculateResults(lobbycode, simpMessagingTemplate, repo);
                }
            }
            /*if(sumOfVotes == possibleVoters){
                CalculateResults.calculateResults(lobbycode, simpMessagingTemplate, repo);
            }
             */
        } catch(Exception e){
                e.printStackTrace();
            }

        return "";

    }




    /*public String votePlayer(String player, String lobbycode, boolean onlyWerewolves){
        //wenn alle gevotet, returnvotingresult
        GameLobby lobby = repo.findById(lobbycode).get();

        JSONParser parser = new JSONParser();
        try {
            JSONObject json = (JSONObject) parser.parse(player);
            String pathPlayer = json.get("path").toString();

            //checken, ob schon alle gevotet haben
            int count = 0;
            if(onlyWerewolves){
                count = lobby.countAllAlive(GameRole.WEREWOLF);
            } else {
                //alle können voten
                count = lobby.countAllAlive(GameRole.WEREWOLF) + lobby.countAllAlive(GameRole.VILLAGER);;
            }

            if(countVotes >= count){
                //wenn schon alle gevotet haben

                checkForWin(lobbycode);

                return denMitGrößtemCountAufTotSetzen(lobby);

            } else {
                //es haben noch nicht alle gevotet
                countVotes++;

                //bei dieser Person den Count um 1 erhöhen
                for(int i = 0; i < lobby.getPlayers().size(); i++){
                    if(lobby.getPlayers().get(i).getPath().equals(pathPlayer)){
                        lobby.getPlayers().get(i).setCountVoteForPlayer(lobby.getPlayers().get(i).getCountVoteForPlayer()+1);
                    }
                }
            }

        } catch (Exception e){
            e.printStackTrace();
        }
        return "";
    } */


    @Transactional()
    @MessageMapping("/totalVote/{lobbycode}")
    @SendTo("/topic/totalVote")
    public String countTotalVote (@DestinationVariable String lobbycode) {
        System.out.println("countTotalVote()"+lobbycode);
    //wenn alle gevotet, returnvotingresult
        GameLobby lobby = repo.findById(lobbycode).get();

        checkForWin(lobbycode);

        return denMitGrößtemCountAufTotSetzen(lobby); //wenn niemand ausgewählt wurde ist der String leer
    }

    private String denMitGrößtemCountAufTotSetzen(GameLobby lobby) {
        System.out.println("denMitGrößtemCountAufTotSetzen()");

        //den mit dem größten count auswählen
        String pathPlayerMitHöchstemCount = "";
        int aktuelleMaxFürScheleife = 0;
        //höchsten Count auswählen
        for(int i = 0; i < lobby.getPlayers().size(); i++){
            if(lobby.getPlayers().get(i).getVotes() >= aktuelleMaxFürScheleife){
                aktuelleMaxFürScheleife = lobby.getPlayers().get(i).getVotes();
            }
        }
        //den mit höchstem Count auf 0 setzen
        String nameDerGetötetenPerson = "";
        for(int i = 0; i < lobby.getPlayers().size(); i++){
            if(lobby.getPlayers().get(i).getVotes() == aktuelleMaxFürScheleife){
                lobby.getPlayers().get(i).setDead(true);
                nameDerGetötetenPerson = lobby.getPlayers().get(i).getPath();
            }
        }

        countVotes = 0;

        for(Player player : lobby.getPlayers()){
            player.resetVotes();
        }

        System.out.println("pathDerGetötetenPerson: " + nameDerGetötetenPerson);

        return nameDerGetötetenPerson;
    }

    @Transactional()
    @SendTo("/topic/gameResult")
    public GameResult checkForWin(String lobbycode) {
        System.out.println("checkForWin()");

        GameLobby lobby = repo.findById(lobbycode).get();

        GameResult result;

        if(lobby.countAllAlive(GameRole.WEREWOLF) >= lobby.countAllAlive(GameRole.VILLAGER) ){
            //Werwölfe haben gewonnen
            result = new GameResult(true, GameRole.WEREWOLF);
            lobby.gameRunning=false;
        } else {
            if (lobby.countAllAlive(GameRole.WEREWOLF)==0){
                //wenn alle Werwölfe tot sind, dann haben die Villager gewonnen
                result = new GameResult(true, GameRole.VILLAGER);
                lobby.gameRunning=false;
            } else {
                result = new GameResult(false);
            }
        }

        return result;
    }
}
