package at.jku.werewolf.io.game;

import at.jku.werewolf.io.lobbymanagement.GameLobby;
import at.jku.werewolf.io.lobbymanagement.GameRole;
import at.jku.werewolf.io.lobbymanagement.LobbyRepository;
import at.jku.werewolf.io.lobbymanagement.Player;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Comparator;
import java.util.List;

public class CalculateResults {
    public static void calculateResults(String lobbycode, SimpMessagingTemplate simpMessagingTemplate, LobbyRepository repo){
        System.out.println("calculateResults() " + lobbycode);

        GameLobby lobby = repo.findById(lobbycode).get();

        //Testen auf unentschieden
        Player mostVotedPlayer = lobby.getPlayers().stream().max(Comparator.comparing(Player::getVotes)).orElse(null);
        int mostVotedCount = lobby.getPlayers().stream().max(Comparator.comparing(Player::getVotes)).orElse(null).getVotes();
        long playerWithMostVotes = lobby.getPlayers().stream().filter( a -> a.getVotes() >= mostVotedCount).count();

        if(playerWithMostVotes == 1){


            lobby.getPlayers().stream().filter(a-> a.getPath() ==mostVotedPlayer.getPath()).forEach(a->a.setDead(true));

            GameRole winning = GameRole.VILLAGER;
            GameRole losing = GameRole.WEREWOLF;

            if(Math.toIntExact(lobby.getPlayers().stream().filter(a-> a.role== GameRole.WEREWOLF&& a.isDead()==false).count())==0 ) {

                GameRole finalWinning = winning;
                lobby.getPlayers().stream().filter(a -> (a.role == finalWinning)).forEach(a -> {
                    simpMessagingTemplate.convertAndSend("/topic/user/" + a.getPath() + "/winning-screen", "won");
                    System.out.println("Erstes if final Winning " + a.getName());
                });

                GameRole finalLosing = losing;
                lobby.getPlayers().stream().filter(a -> (a.role == finalLosing)).forEach(a -> {
                    simpMessagingTemplate.convertAndSend("/topic/user/" + a.getPath() + "/losing-screen", "lost");
                    System.out.println("Erstes if final losing " + a.getName());
                });
                lobby.setGameRunning(false);
                repo.saveAndFlush(lobby);

            } else if( Math.toIntExact(lobby.getPlayers().stream().filter(a-> a.role== GameRole.WEREWOLF&& a.isDead()==false).count())
                    >= Math.toIntExact(lobby.getPlayers().stream().filter(a-> a.role== GameRole.VILLAGER&& a.isDead()==false).count())) {
                winning = GameRole.WEREWOLF;
                losing = GameRole.VILLAGER;

                GameRole finalWinning = winning;
                lobby.getPlayers().stream().filter(a -> (a.role == finalWinning)).forEach(a -> {
                    simpMessagingTemplate.convertAndSend("/topic/user/" + a.getPath() + "/winning-screen", "won");
                    System.out.println("Else if final Winning " + a.getName());
                });

                GameRole finalLosing = losing;
                lobby.getPlayers().stream().filter(a -> (a.role == finalLosing)).forEach(a -> {
                    simpMessagingTemplate.convertAndSend("/topic/user/" + a.getPath() + "/losing-screen", "lost");
                    System.out.println("else if final losing " + a.getName());
                });
                lobby.setGameRunning(false);
                repo.saveAndFlush(lobby);

            } else {
                repo.saveAndFlush(lobby);
                lobby.getPlayers().stream().filter(a -> a.isDead()).forEach(System.out::println);
                lobby.getPlayers().stream().filter(a -> a.isDead()).filter(a -> (a.getPath() == mostVotedPlayer.getPath())).forEach(a -> {
                    simpMessagingTemplate.convertAndSend("/topic/user/" + a.getPath() + "/setToDead", "dead");
                });
            }

        }


        //ToDo Resultat abschicken oder nur den Verlierer?

        //alle Votes löschen
        lobby.getPlayers().stream().forEach(a-> a.resetVotes());

        repo.saveAndFlush(lobby);



    }
}
