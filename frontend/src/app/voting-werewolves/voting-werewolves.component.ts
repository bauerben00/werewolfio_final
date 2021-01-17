import {Component, OnInit} from '@angular/core';
import {LobbyDataService} from '../lobby-data.service';
import {Player} from '../player';
import {StompService} from '../stomp.service';
import {interval} from "rxjs";
import {map, takeWhile} from "rxjs/operators";
import {Router} from "@angular/router";
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-voting-werewolves',
  templateUrl: './voting-werewolves.component.html',
  styleUrls: ['./voting-werewolves.component.css']
})
export class VotingWerewolvesComponent implements OnInit {
  data: LobbyDataService;
  stomp: StompService;
  router: Router;
  hasVoted: boolean = false;
  count = 100;
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
      //this.router.navigate(['day-time']);

    }
  }, 1000);
  private maxValue = 100;
  countDown$ = interval(1000).pipe(
    map(value => this.maxValue - value),
    takeWhile(x => x >= 0)
  );

  constructor(data: LobbyDataService, stomp: StompService, router: Router) {
    this.stomp = stomp;
    this.data = data;
    this.router = router;
  }

  ngOnInit(): void {
    this.hasVoted = false;
    this.maxValue = this.data.game.votingtime;
    this.count = this.data.game.votingtime;
  }

  voteForPlayer(p: Player) {
    this.stomp.voteForPlayer(p);
    this.hasVoted = true;
  }


}
