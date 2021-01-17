import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {StompService} from "../stomp.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css']
})
export class JoinGameComponent {
  stomp: StompService;


  addressForm = this.fb.group({
    code: [null, Validators.required],
    vorname: [null, Validators.required]
  });

  hasUnitNumber = false;

  constructor(private fb: FormBuilder, stomp: StompService,private _snackBar: MatSnackBar) {
    this.stomp = stomp;
  }

  onSubmit() {
    this.stomp.joinGame(this.addressForm.get("code").value,
      this.addressForm.get("vorname").value);
    this._snackBar.open("Joined Game successfully");
  }


}
