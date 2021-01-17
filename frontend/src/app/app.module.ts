import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {StartscreenComponent} from './startscreen/startscreen.component';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CreateLobbyComponent} from './create-lobby/create-lobby.component';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {InjectableRxStompConfig, RxStompService, rxStompServiceFactory,} from '@stomp/ng2-stompjs';
import {myRxStompConfig} from './my-rx-stomp.config';
import {JoinGameComponent} from './join-game/join-game.component';
import {NightComponent} from './night/night.component';
import {DiscussionTimeComponent} from './discussion-time/discussion-time.component';
import {DeadComponent} from './dead/dead.component';
import {StartPlayComponent} from './start-play/start-play.component';
import {RoleinformationComponent} from './roleinformation/roleinformation.component';
import {VotingWerewolvesComponent} from './voting-werewolves/voting-werewolves.component';
import {VotingVillagersComponent} from './voting-villagers/voting-villagers.component';
import {GameResultComponent} from './game-result/game-result.component';
import {DayTimeComponent} from './day-time/day-time.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { WinningScreenComponent } from './winning-screen/winning-screen.component';
import { LosingScreenComponent } from './losing-screen/losing-screen.component';
const routes: Routes = [
  {path: 'home', component: StartscreenComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'create-lobby', component: CreateLobbyComponent},
  {path: 'join-game', component: JoinGameComponent},
  {path: 'night', component: NightComponent},
  {path: 'discussion-time', component: DiscussionTimeComponent},
  {path: 'dead', component: DeadComponent},
  {path: 'start-play', component: StartPlayComponent},
  {path: 'voting-werevolves', component: VotingWerewolvesComponent},
  {path: 'voting-villagers', component: VotingVillagersComponent},
  {path: 'game-result', component: GameResultComponent},
  {path: 'day-time', component: DayTimeComponent},
  {path: 'winning-screen', component: WinningScreenComponent},
  {path: 'losing-screen', component: LosingScreenComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    StartscreenComponent,
    CreateLobbyComponent,
    JoinGameComponent,
    NightComponent,
    DiscussionTimeComponent,
    DeadComponent,
    StartPlayComponent,
    RoleinformationComponent,
    VotingWerewolvesComponent,
    VotingVillagersComponent,
    GameResultComponent,
    DayTimeComponent,
    WinningScreenComponent,
    LosingScreenComponent
  ],
  imports: [
    BrowserModule, RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    MatButtonModule,
    MatToolbarModule, FlexLayoutModule, MatInputModule, MatSelectModule, MatRadioModule, MatCardModule, MatSnackBarModule, ReactiveFormsModule
    ,ClipboardModule
  ], exports: [RouterModule],
  providers: [{
    provide: InjectableRxStompConfig,
    useValue: myRxStompConfig,
  }, ClipboardModule,
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig],
    },],
  bootstrap: [AppComponent]
})
export class AppModule {
}
