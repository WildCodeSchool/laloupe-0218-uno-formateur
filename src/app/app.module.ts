import { AuthService } from './auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatToolbarModule, MatChipsModule } from '@angular/material';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import { MatchMakingComponent } from './match-making/match-making.component';
import { LoginComponent } from './login/login.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'game/:id', component: GameComponent },
  { path: 'matchmaking', component: MatchMakingComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    HomeComponent,
    MatchMakingComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatButtonModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatChipsModule,
  ],
  providers: [
    AuthService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
