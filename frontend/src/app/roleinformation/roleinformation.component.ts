import {Component, OnInit} from '@angular/core';
import {StompService} from "../stomp.service";

@Component({
  selector: 'app-roleinformation',
  templateUrl: './roleinformation.component.html',
  styleUrls: ['./roleinformation.component.css']
})
export class RoleinformationComponent implements OnInit {
  stomp: StompService;

  constructor(stomp: StompService) {
    this.stomp = stomp;
  }

  ngOnInit(): void {

  }


}
