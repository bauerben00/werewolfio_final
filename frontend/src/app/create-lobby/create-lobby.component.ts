import {Component} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {StompService} from "../stomp.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Clipboard} from '@angular/cdk/clipboard';
@Component({
  selector: 'app-create-lobby',
  templateUrl: './create-lobby.component.html',
  styleUrls: ['./create-lobby.component.css']
})
export class CreateLobbyComponent {

  min: number = 1000;
  max: number = 10000;
  code: number;
  stomp: StompService;
  test: String;
  addressForm = this.fb.group({
    firstName: [null, Validators.required],
    votingTime: [null, Validators.required],
    discussionTime: [null, Validators.required],
    maxCountPlayers: [null, Validators.required],
    numberWerewolves: [null, Validators.compose([
      Validators.required, Validators.minLength(1), Validators.maxLength(2)])
    ]
  });
  hasUnitNumber = false;
  voteTimeNumber : number = 0;

  constructor(private fb: FormBuilder, stomp: StompService,private _snackBar: MatSnackBar,private clipboard: Clipboard) {
    this.code = Math.round((Math.random() * (this.max - this.min)) + this.min);
    this.stomp = stomp;
  }

  private _codeServer: string;

  set codeServer(value: string) {
    this._codeServer = value;
  }

  onSubmit() {
    let isWrong: boolean = false;
    if(this.addressForm.get("firstName").value == null){
      this._snackBar.open("Lobby can't be created because your name is empty",'Close', {
        duration: 5000
      });
      isWrong = true;
    }
    if(this.addressForm.get("numberWerewolves").value <= 0  ){
      this._snackBar.open("Lobby can't be created the number of Werewolves is <= 0",'Close', {
        duration: 5000
      });
      isWrong = true;
    }

    if(isNaN(this.addressForm.get("votingTime").value)){
      this._snackBar.open("Lobby can't be created because voting time is not a number",'Close', {
        duration: 5000
      });
      isWrong = true;
    }

    if(isNaN(this.addressForm.get("discussionTime").value)){
      this._snackBar.open("Lobby can't be created because discussion time is not a number",'Close', {
        duration: 5000
      });
      isWrong = true;
    }

    if(isNaN(this.addressForm.get("maxCountPlayers").value)){
      this._snackBar.open("Lobby can't be created because the field number of players is not a number",'Close', {
        duration: 5000
      });
      isWrong = true;
    }

    if(this.addressForm.get("votingTime").value <= 12){
      this._snackBar.open("Lobby can't be created because voting <= 12",'Close', {
        duration: 5000
      });
      isWrong = true;

    }
    if(this.addressForm.get("discussionTime").value <= 20){
      this._snackBar.open("Lobby can't be created because discussionTime <= 20",'Close', {
        duration: 5000
      });
      isWrong = true;

    }

    if(!isWrong){
      this.stomp.startNewGame(
        this.addressForm.get("numberWerewolves").value,
        this.addressForm.get("votingTime").value,
        this.addressForm.get("discussionTime").value,
        this.addressForm.get("firstName").value);

      this._snackBar.open("Created Lobby",'Schließen', {
        duration: 5000
      });
    }

  }

  generateCode() {
    this._codeServer = this.stomp.codeGame;
    console.log("generateCode() code _codeServer" + this._codeServer);

    this._snackBar.open("Der Code lautet: " + this._codeServer + " und wurde in deine Zwischenablage kopiert",'Schließen', {
      duration: 5000
    });
    this.clipboard.copy(this._codeServer);
  }

  startGame() {
    let canBeStartet: boolean = true;

    /*if(this.addressForm.get("numberWerewolves").value >= this.stomp.countAllPlayers()){
      this._snackBar.open("Play can't be started because there should be more werewolves than there are players",'Close', {
        duration: 5000
      });
      canBeStartet = false;
    }*/

    if(canBeStartet){
      this._codeServer = this.stomp.codeGame;
      console.log("startGame() code _codeServer" + this._codeServer);

      if (this._codeServer.length > 0) {
        this.stomp.startLobby(this._codeServer);
      } else {
        console.log("Fehler startGame()");
      }
    }

  }
}
