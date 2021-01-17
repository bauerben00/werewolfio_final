import {Component, OnInit} from '@angular/core';
import {StompService} from "../stomp.service";
import {interval} from "rxjs";
import {map, takeWhile} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-night',
  templateUrl: './night.component.html',
  styleUrls: ['./night.component.css']
})
export class NightComponent implements OnInit {
  stomp: StompService;
  router: Router;
  count = 10;
  timeout = setInterval(() => {
    if (this.count > 0) {
      this.count -= 1;
    } else {
      clearInterval(this.timeout);
      this.router.navigate(['voting-werevolves']);

    }
  }, 1000);
  private maxValue = 10;
  countDown$ = interval(1000).pipe(
    map(value => this.maxValue - value),
    takeWhile(x => x >= 0)
  );

  constructor(stomp: StompService, router: Router) {
    this.stomp = stomp;
    this.router = router;
  }

  ngOnInit(): void {
  }

}
