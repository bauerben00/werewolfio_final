import {Component, OnInit} from '@angular/core';
import {StompService} from "../stomp.service";
import {interval} from 'rxjs';
import {map, takeWhile} from 'rxjs/operators';
import {Router} from "@angular/router";
import {LobbyDataService} from "../lobby-data.service";

@Component({
  selector: 'app-discussion-time',
  templateUrl: './discussion-time.component.html',
  styleUrls: ['./discussion-time.component.css']
})
export class DiscussionTimeComponent implements OnInit {
  stomp: StompService;
  data: LobbyDataService;
  count = 10;
  private router: Router;
  private maxValue = 10;
  timeout;
  countDown$;

  /*timeout = setInterval(() => {
    if (this.count > 0) {
      this.count -= 1;
    } else {
      clearInterval(this.timeout);
      //this.router.navigate(['voting-villagers']);

    }
  }, 1000);

  countDown$ = interval(1000).pipe(
    map(value => this.maxValue - value),
    takeWhile(x => x >= 0)
  );

   */

  constructor(stomp: StompService, router: Router, data: LobbyDataService) {
    this.stomp = stomp;
    this.router = router;
    this.data = data;
  }



  ngOnInit(): void {
    this.maxValue = this.data.game.discussiontime;
    this.count = this.data.game.discussiontime;

    console.log(this.maxValue);

    this.timeout = setInterval(() => {
      if (this.count > 0) {
        this.count -= 1;
      } else {
        clearInterval(this.timeout);
        //this.router.navigate(['voting-villagers']);

      }
    }, 1000);

    this.countDown$ = interval(1000).pipe(
      map(value => this.maxValue - value),
      takeWhile(x => x >= 0)
    );


  }


}
