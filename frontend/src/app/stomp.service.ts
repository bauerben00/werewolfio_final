import {Injectable, OnInit} from '@angular/core';
import {RxStompService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from '@angular/router';
import {LobbyDataService} from './lobby-data.service';
import {GameLobby} from './game-lobby';
import {Player} from './player';
import {GameResult} from "./game-result";


@Injectable({
  providedIn: 'root'
})
export class StompService implements OnInit {
// Stompservice benützen zum Daten senden
  stomp: RxStompService;
  codeGame: string;
  private snackBar: MatSnackBar;

  constructor(private rxStompService: RxStompService, private _snackBar: MatSnackBar, private router: Router, private data: LobbyDataService) {
    this.stomp = rxStompService;
    this.snackBar = _snackBar;
    this.router = router;
  }

  testGreeting() {

    this.stomp.watch('/topic/greetings').subscribe((message: Message) => {
      console.log(message.body);

    });

    const message = `Message generated at ${new Date}`;
    this.stomp.publish({destination: '/app/hello', body: message});
  }

  removePlayerByPath(path: string) {
   this.data.werewolvesPaths= this.data.werewolvesPaths.filter(a => a.toLowerCase()!=path.toLowerCase())
    this.data.game.players = this.data.game.players.filter( a => a.path.toLowerCase() != path.toLowerCase() );
  }

  ngOnInit(): void {
    //integration von voted Player
    this.stomp.watch("/topic/werewolfvote").subscribe((message: Message) => {
      //Response ist leer, wenn noch nicht alle gevotet haben
      console.log("Response: String countWerewolfVote " + message.body);
      this.removePlayerByPath(message.body);
    });

    this.stomp.watch("/topic/totalVote").subscribe((message: Message) => {
      //Response ist leer, wenn niemand ausgewählt wurde, sonst diese Person
      console.log("Response: String countTotalVote " + message.body);
      this.removePlayerByPath(message.body);
    });

    this.stomp.watch("/topic/gameResult").subscribe((message: Message) => {
      //Response ist leer, liefert das Gameresult
      let responseGameResult: GameResult = JSON.parse(message.body);
      console.log("Response: SgameResult: Is over? " + responseGameResult.isOver);
      console.log("Response: SgameResult: who won " + responseGameResult.winner);
      this.router.navigate(['game-result'])
    });


  }

  navigateToWerewolvesPhase() {

  }

  startNewGame(nrWerewolves: number, votingtime: number, discussiontime: number, firstName: string) {

    this.stomp.watch('/topic/createLobby').subscribe((message: Message) => {

      let response: ResponeCreateLobby = JSON.parse(message.body);

      console.log("message.body in startNewGame()" + response.lobbycode);
      this.codeGame = response.lobbycode;
      this.data.codeGame = response.lobbycode;
      this.data.playername = response.userName;
      this.stomp.watch("/topic/user/" + response.userName + "/WaitForLobbyStart").subscribe((message: Message) => {
        this.prepareWerewolfdata(message.body.split('|'));
        this.navigateToWerewolvesPhase()

        this.snackBar.open(message.body, 'Undo');

        this.waitForLobbyInformation(response.lobbycode);



        console.log("Wait for Lobby start" + response.userName);

        this.winningLoosingDeadPhaseSwitch(response.userName);
      });


    });

    const message = JSON.stringify({nrWerewolves, votingtime, discussiontime, firstName});
    this.stomp.publish({destination: '/app/createLobby', body: message});

  }

  waitForLobbyInformation(code: String) {
    this.stomp.watch("/app/getLobbyInformation/" + code).subscribe((message: Message) => {

      console.log("Watch get lobby infos" + message.body);
      let responseGameLobby: GameLobby = JSON.parse(message.body);
      this.data.game = responseGameLobby;

      this.router.navigate(['discussion-time']);



    });
  }

  joinGame(code: string, vorname: string) {
    this.codeGame = code;

    this.stomp.watch('/topic/joinLobby').subscribe((message: Message) => {
      console.log("Join Lobby" + message.body);
      var array = message.body.split('|');
      console.log("Game Code" + array[1]);
      console.log("His path" + array[0]);
      this.stomp.watch("/topic/user/" + array[0] + "/WaitForLobbyStart").subscribe((message: Message) => {
        if (message.body.includes("Werewolf")) {
//werwolf array ist 0 Werwolf 1 2 3 4.. player(paths) die werwolf sind
          this.prepareWerewolfdata(array);
        } else {
//villager array 1 ist game code 0 ist player path
          this.waitForLobbyInformation(array[1]);
          this.data.isWerewolf = false;
          this.data.werewolvesPaths = [];
        }
        this.navigateToWerewolvesPhase();

        this.snackBar.open(message.body, 'Undo');
        console.log("Wait for Lobby start" + message.body);
      });



      //begin

      this.winningLoosingDeadPhaseSwitch(array[0]);

    });


    //end

    const message = JSON.stringify({code, vorname});
    this.stomp.publish({destination: '/app/joinLobby', body: message});


  }

  private winningLoosingDeadPhaseSwitch(name : string){

    this.stomp.watch("/topic/user/" + name + "/PhaseSwitch").subscribe((message: Message) => {
      console.log(message.body);
      if(message.body.match("discussion-time")){
        console.log("change to discussion-time");
        this.router.navigate(['discussion-time']);
      }
      if(message.body.match("voting-villagers")){
        console.log("change to voting-villagers");
        this.router.navigate(['voting-villagers']);
      }
      if(message.body.match("day-time")){
        console.log("change to day-time");
        this.router.navigate(['day-time']);
      }
      if(message.body.match("voting-werevolves")){
        console.log("change to voting-werevoles");
        this.router.navigate(['voting-werevolves']);
      }
      if(message.body.match("night")){
        console.log("change to night");
        this.router.navigate(['night']);
      }
    });

    this.stomp.watch("/topic/user/" + name + "/setToDead").subscribe((message: Message) => {
      console.log("change to dead:  " + message.body + " name ist " + name);
      this.router.navigate(['dead']);

    });

    this.stomp.watch("/topic/user/" + name + "/winning-screen").subscribe((message: Message) => {
      console.log(message.body);
      this.router.navigate(['winning-screen']);
    });

    this.stomp.watch("/topic/user/" +name + "/losing-screen").subscribe((message: Message) => {
      console.log(message.body);
      this.router.navigate(['losing-screen']);
    });


  }


  private prepareWerewolfdata(array: string[]) {
    this.data.werewolvesPaths = array.splice(0, 1);
    console.log(this.data.werewolvesPaths)
    this.data.isWerewolf = true;
  }

  startLobby(code: string) {
    console.log("startlobby() code" + code);

    const message = code;
    this.stomp.publish({destination: '/app/startLobby/' + code, body: message});
  }


  voteForPlayer(p: Player) {
    console.log("voteForPlayer() wird aufgerufen");
    const message = JSON.stringify(p);
    this.stomp.publish({destination: '/app/werewolfvote/' + this.codeGame, body: message});
  }

  villagerVote(p: Player){
    console.log("villagerVote() wird aufgerufen");
    const message = JSON.stringify(p);
    this.stomp.publish({destination: '/app/playervote/' + this.codeGame, body: message});
  }

  voteUndecided() {
    //diese Funktion wird aufgerufen, wenn der Timer abgelaufen ist
    console.log("voteForPlayerEnds() wird aufgerufen");
    const message = "";
    this.stomp.publish({destination: '/app/totalVote/' + this.codeGame, body: message});
  }

  public countAllPlayers() : number {
    return this.data.werewolvesPaths.length;
  }

}

interface ResponeCreateLobby {
  lobbycode: string;
  userName: string;
}
