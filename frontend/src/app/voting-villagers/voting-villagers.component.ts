import {Component, OnInit} from '@angular/core';
import {LobbyDataService} from "../lobby-data.service";
import {StompService} from "../stomp.service";
import {Player} from "../player";
import {interval} from "rxjs";
import {map, takeWhile} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-voting-villagers',
  templateUrl: './voting-villagers.component.html',
  styleUrls: ['./voting-villagers.component.css']
})
export class VotingVillagersComponent implements OnInit {

  data: LobbyDataService;
  stomp: StompService;
  router: Router;
  count = 10;
  hasVoted: boolean = false;
  timeout = setInterval(() => {
    if (this.count > 0) {
      this.count -= 1;
    } else {
      clearInterval(this.timeout);
      if (this.hasVoted = false) {
        //console.log("voted Undecided");
        //this.stomp.voteUndecided();
      }
      //console.log("time over");
      //this.router.navigate(['night']);
    }
  }, 1000);
  private maxValue = 10;
  countDown$ = interval(1000).pipe(
    map(value => this.maxValue - value),
    takeWhile(x => x >= 0)
  );

  constructor(data: LobbyDataService, stomp: StompService, router: Router) {
    this.stomp = stomp;
    this.data = data;
    this.router = router;
  }

  // RxJs way
  // The interval Observable will emit increasing values and we want to display decreasing ones, we will log the difference between the total length of our countdown and the value emitted:



  ngOnInit(): void {
    this.maxValue = this.data.game.votingtime;
    this.count = this.data.game.votingtime;
  }

  villagerVote(p: Player) {
    this.stomp.villagerVote(p);
    this.hasVoted = true;
  }

}
