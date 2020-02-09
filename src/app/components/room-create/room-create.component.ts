import { GameService } from './../../services/game.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-create',
  templateUrl: './room-create.component.html',
  styleUrls: ['./room-create.component.scss']
})
export class RoomCreateComponent implements OnInit {

  otherPlayerJoined: boolean = false;
  isRoomCreated: boolean = false;
  roomId: string = '';

  constructor(
    private gameService: GameService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.createRoomEmitter();
    this.onRoomJoinedListener();
    this.onGameStartListener();
  }

  private createRoomEmitter() {
    this.gameService.createRoom();
  }

  private onRoomJoinedListener(): void {
    this.gameService.onRoomJoined().subscribe((data) => {
      this.isRoomCreated = true;
      this.roomId = data.roomId; // to be copied clicking the copy button
      localStorage.setItem('joinedRoomID', data.roomId);
      localStorage.setItem('player', 'red');
    });
  }

  private onGameStartListener(): void {
    this.gameService.onGameStart().subscribe(() => {
      this.otherPlayerJoined = true;
      this.router.navigate(['/game']);
    });
  }

}
