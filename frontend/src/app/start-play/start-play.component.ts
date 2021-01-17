import {Component, OnInit} from '@angular/core';
import {StompService} from "../stomp.service";

@Component({
  selector: 'app-start-play',
  templateUrl: './start-play.component.html',
  styleUrls: ['./start-play.component.css']
})
export class StartPlayComponent implements OnInit {

  stomp: StompService;
  private code: string;

  constructor(stomp: StompService) {
    this.stomp = stomp;
    this.code = this.stomp.codeGame;
  }

  ngOnInit(): void {

  }

}
