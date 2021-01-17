import {Component, OnInit} from '@angular/core';
import {interval} from "rxjs";
import {map, takeWhile} from "rxjs/operators";
import {Router} from "@angular/router";
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-day-time',
  templateUrl: './day-time.component.html',
  styleUrls: ['./day-time.component.css']
})
export class DayTimeComponent implements OnInit {
  router: Router;
  count = 10;
  timeout = setInterval(() => {
    if (this.count > 0) {
      this.count -= 1;
    } else {
      clearInterval(this.timeout);
      this.router.navigate(['discussion-time']);

    }
  }, 1000);
  private maxValue = 10;
  countDown$ = interval(1000).pipe(
    map(value => this.maxValue - value),
    takeWhile(x => x >= 0)
  );

  constructor(router: Router) {
    this.router = router
  }

  ngOnInit(): void {


    let audio = new Audio();
    audio.src = "../../../assets/audio/day.wav";
    audio.load();
    audio.play();

  }

}
