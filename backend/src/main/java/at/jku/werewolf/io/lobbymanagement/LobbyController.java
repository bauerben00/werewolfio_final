package at.jku.werewolf.io.lobbymanagement;


import at.jku.werewolf.io.game.CalculateResults;
import at.jku.werewolf.io.game.VotingController;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import javax.transaction.Transactional;
import java.util.Optional;
import java.util.Random;
import java.util.Timer;
import java.util.TimerTask;

@Controller
public class LobbyController {
    private final SimpMessagingTemplate simpMessagingTemplate;
    LobbyRepository repo;
    PlayerRepository playerRepo;


    public LobbyController(SimpMessagingTemplate simpMessagingTemplate, LobbyRepository repo, PlayerRepository playerRepo) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.repo = repo;
        this.playerRepo = playerRepo;
    }

    @MessageMapping("/createLobby")
    @SendTo("/topic/createLobby")
    @Transactional
    public ReturnFromCreateLobby createLobby(String values) {

        JSONParser parser = new JSONParser();
        try {
            JSONObject json = (JSONObject) parser.parse(values);

            int nrWerewolves = ((Long) json.get("nrWerewolves")).intValue();
            int votingtime = Integer.parseInt((String) json.get("votingtime"));
            int discussiontime = Integer.parseInt((String) json.get("discussiontime"));
            String playerName = (String) json.get("firstName");

            System.out.println("createLobby()" + playerName); //todo entfernen

            LobbyConfiguration configuration = new LobbyConfiguration(nrWerewolves, votingtime, discussiontime);

            GameLobby lobby = new GameLobby(configuration);
            Player host = new Player(playerName);
            host.setHost(true);

            lobby.getPlayers().add(host);
            //lobby.setLobbycode( Integer.toString(code));

            repo.save(lobby);

            Iterable<GameLobby> test = repo.findAll();//todo entfernen
            System.out.println("lobby.getLobbycode() " + lobby.getLobbycode());//todo entfernen

            return new ReturnFromCreateLobby(lobby.getLobbycode(), host.getPath());

        } catch (ParseException e) {
            e.printStackTrace();
        }

        return new ReturnFromCreateLobby();
    }

    @MessageMapping("/joinLobby")
    @SendTo("/topic/joinLobby")
    @Transactional
    public String joinLobby(String values) {
        JSONParser parser = new JSONParser();
        try {
            JSONObject json = (JSONObject) parser.parse(values);

            String vorname = (String) json.get("vorname");
            String code = (String) json.get("code");

            System.out.println("joinLobby(): " + vorname); //todo entfernen

            System.out.println("vorname " + vorname + "code: " + code);

            Optional<GameLobby> lobby = repo.findById(code);
            if (lobby.isEmpty()) return "Lobby doesnt exist";
            else {
                GameLobby lob = lobby.get();
                Player player = new Player(vorname);
                playerRepo.saveAndFlush(player);
                lob.getPlayers().add(player);
                repo.saveAndFlush(lob);
                lobby.get().getPlayers().forEach(a -> System.out.println(a.getPath()));
                System.out.println("player.getPath() " + player.getPath()); //todo entfernen debug point
                return player.getPath() + "|" + lob.getLobbycode();
            }


        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println();
        //todo fehlerbehandlung

        return "Error";

    }

    @MessageMapping("/startLobby/{lobbycode}")
    @Transactional
    public String startLobby(@DestinationVariable String lobbycode) {
        System.out.println("startLobby()" + lobbycode); //todo entfernen

        if (repo.findById(lobbycode).isEmpty()) return "Lobby doesnt exist";
        GameLobby lobby = repo.findById(lobbycode).get();
        int werewolvecount = 0;
        for (Player player : lobby.getPlayers()) {
            player.role = GameRole.VILLAGER;
        }
        if (lobby.getWerewolves() > lobby.getPlayers().size()) {
            return "Es gibt nicht so viele Spiele wie es Werwölfe sein sollen";
        }


        while (werewolvecount < lobby.getWerewolves()) {
            Random r = new Random();
            int low = 0;
            int high = lobby.getWerewolves();
            int selection = r.nextInt(high - low) + low;
            System.out.println("Spieler mit Nummer " + selection + "wurde ausgewäht");
            if (lobby.getPlayers().get(selection).getRole().equals(GameRole.WEREWOLF)) ;
            else {
                lobby.getPlayers().get(selection).role = GameRole.WEREWOLF;
                werewolvecount++;
            }
        }

        String werewolves = "Werwolf|" + lobby.listWerewolves();

        //send werewolves information about other werewolves
        lobby.getPlayers().stream().filter(a -> (a.role == GameRole.WEREWOLF)).forEach(a -> {
            simpMessagingTemplate.convertAndSend("/topic/user/" + a.getPath() + "/WaitForLobbyStart", werewolves);
        });
        lobby.getPlayers().stream().filter(a -> (a.role == GameRole.VILLAGER)).forEach(a -> {
            simpMessagingTemplate.convertAndSend("/topic/user/" + a.getPath() + "/WaitForLobbyStart", a.getRole());
        });

        System.out.println();
        runGame(lobby);
        return "Game Started";
    }

    private void runGame(GameLobby lobby) {
        Timer timer = new Timer("Timer");
        Timer timer2 = new Timer("Timer");
        Timer timer3 = new Timer("Timer");
        Timer timer4 = new Timer("Timer");
        Timer timer5 = new Timer("Timer");
        long period = 10000L * 2 + lobby.votingtime * 1000 * 2 + lobby.discussiontime * 1000;
        TimerTask playervote = new TimerTask() {
            @Override
            public void run() {
                if (!lobby.isGameRunning()) {
                    timer.cancel();
                    timer2.cancel();
                    timer3.cancel();
                    timer4.cancel();
                    timer5.cancel();
                }

                CalculateResults.calculateResults(lobby.lobbycode, simpMessagingTemplate, repo);
                if(repo.findById(lobby.lobbycode).get().isGameRunning()){
                    repo.findById(lobby.lobbycode).get().getPlayers().stream().filter(a -> a.isDead()==false).forEach(a -> {
                        simpMessagingTemplate.convertAndSend("/topic/user/" + a.getPath() + "/PhaseSwitch", "voting-villagers");
                    });
                }


            }
        };
        TimerTask discussiontime = new TimerTask() {
            @Override
            public void run() {
                if (!lobby.isGameRunning()) {
                    timer.cancel();
                    timer2.cancel();
                    timer3.cancel();
                    timer4.cancel();
                    timer5.cancel();
                }

                if(repo.findById(lobby.lobbycode).get().isGameRunning()){
                    repo.findById(lobby.lobbycode).get().getPlayers().stream().filter(a -> a.isDead()==false).forEach(a -> {
                        simpMessagingTemplate.convertAndSend("/topic/user/" + a.getPath() + "/PhaseSwitch", "discussion-time");
                    });
                }


            }
        };
        TimerTask day = new TimerTask() {
            @Override
            public void run() {
                if (!lobby.isGameRunning()) {
                    timer.cancel();
                    timer2.cancel();
                    timer3.cancel();
                    timer4.cancel();
                    timer5.cancel();
                }

                if(repo.findById(lobby.lobbycode).get().isGameRunning()){
                    repo.findById(lobby.lobbycode).get().getPlayers().stream().filter(a -> a.isDead()==false).forEach(a -> {
                        simpMessagingTemplate.convertAndSend("/topic/user/" + a.getPath() + "/PhaseSwitch", "day-time");
                    });
                }


            }
        };
        TimerTask votingwerewolves = new TimerTask() {
            @Override
            public void run() {
                if (!lobby.isGameRunning()) {
                    timer.cancel();
                    timer2.cancel();
                    timer3.cancel();
                    timer4.cancel();
                    timer5.cancel();
                }
                CalculateResults.calculateResults(lobby.lobbycode, simpMessagingTemplate, repo);

                if(repo.findById(lobby.lobbycode).get().isGameRunning()){
                    repo.findById(lobby.lobbycode).get().getPlayers().stream().filter(a -> a.isDead()==false).forEach(a -> {
                        simpMessagingTemplate.convertAndSend("/topic/user/" + a.getPath() + "/PhaseSwitch", "voting-werevolves");
                    });
                }


            }
        };
        TimerTask night = new TimerTask() {
            public void run() {
                if (!lobby.isGameRunning()) {
                    timer.cancel();
                    timer2.cancel();
                    timer3.cancel();
                    timer4.cancel();
                    timer5.cancel();
                }

                CalculateResults.calculateResults(lobby.lobbycode, simpMessagingTemplate, repo);

                if(repo.findById(lobby.lobbycode).get().isGameRunning()){


                    repo.findById(lobby.lobbycode).get().getPlayers().stream().filter(a -> a.isDead()==false).forEach(a -> {
                        simpMessagingTemplate.convertAndSend("/topic/user/" + a.getPath() + "/PhaseSwitch", "night");
                    });
                }

            }
        };


        timer.scheduleAtFixedRate(night, lobby.discussiontime * 1000, period);
        timer2.scheduleAtFixedRate(votingwerewolves, lobby.discussiontime * 1000 + lobby.votingtime * 1000, period);
        timer3.scheduleAtFixedRate(day, lobby.discussiontime * 1000 + 10000L + lobby.votingtime * 1000, period);
        timer4.scheduleAtFixedRate(discussiontime, lobby.discussiontime * 1000 + 10000L + lobby.votingtime * 1000 + lobby.discussiontime * 1000, period);
        timer5.scheduleAtFixedRate(playervote, lobby.discussiontime * 1000 + 10000L + lobby.votingtime * 2 * 1000 + lobby.discussiontime * 1000, period);

    }

    @SubscribeMapping("/getLobbyInformation/{lobbycode}")
    @Transactional
    public GameLobby getLobbyInformation(@DestinationVariable String lobbycode) {
        System.out.println("getLobbyInformation()");
        return repo.findById(lobbycode).get();
    }


}
