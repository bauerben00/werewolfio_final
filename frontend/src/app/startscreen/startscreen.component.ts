import {Component, OnInit} from '@angular/core';
import {StompService} from '../stomp.service';

@Component({
  selector: 'app-startscreen',
  templateUrl: './startscreen.component.html',
  styleUrls: ['./startscreen.component.css']
})
export class StartscreenComponent implements OnInit {
  stomp: StompService;

  constructor(stomp: StompService) {
    this.stomp = stomp;
  }

  ngOnInit(): void {
    this.stomp.testGreeting();

  }

}
