import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RoomJoinComponent } from './components/room-join/room-join.component';
import { GameComponent } from './components/game/game.component';
import { RoomCreateComponent } from './components/room-create/room-create.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'create', component: RoomCreateComponent },
  { path: 'join', component: RoomJoinComponent },
  { path: 'game', component: GameComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
