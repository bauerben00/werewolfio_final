import {Component, OnInit} from '@angular/core';
import {StompService} from "../stomp.service";

@Component({
  selector: 'app-dead',
  templateUrl: './dead.component.html',
  styleUrls: ['./dead.component.css']
})
export class DeadComponent implements OnInit {
  stomp: StompService;

  constructor(stomp: StompService) {
    this.stomp = stomp;
  }

  ngOnInit(): void {
  }

}
