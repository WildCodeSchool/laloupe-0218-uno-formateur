import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import { MatchMakingComponent } from './match-making/match-making.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game/:id/:username', component: GameComponent },
  { path: 'matchmaking', component: MatchMakingComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    HomeComponent,
    MatchMakingComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
