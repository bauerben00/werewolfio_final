import {Component} from '@angular/core';
import {StompService} from './stomp.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Client';

  constructor(stomp: StompService) {

  }

}
