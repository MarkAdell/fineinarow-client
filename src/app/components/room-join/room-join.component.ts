import { GameService } from './../../services/game.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-room-join',
  templateUrl: './room-join.component.html',
  styleUrls: ['./room-join.component.scss']
})
export class RoomJoinComponent implements OnInit {

  otherPlayerJoined: boolean = false;
  isRoomJoined: boolean = false;
  roomId = new FormControl('', [Validators.required, Validators.minLength(5)]);

  constructor(
    private gameService: GameService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.onRoomJoinedListener();
    this.onGameStartListener();
    this.onCustomErrorListener();
  }

  onJoinClick() {
    if (this.roomId.valid) {
      this.gameService.joinRoom(this.roomId.value);
    }
  }

  private onRoomJoinedListener(): void {
    this.gameService.onRoomJoined().subscribe((data) => {
      this.isRoomJoined = true;
      localStorage.setItem('joinedRoomID', data.roomId);
      if (data.numberOfMembers === 1) {
        localStorage.setItem('player', 'red');
      } else {
        localStorage.setItem('player', 'blue');
      }
    });
  }

  private onGameStartListener(): void {
    this.gameService.onGameStart().subscribe(() => {
      this.otherPlayerJoined = true;
      this.router.navigate(['/game']);
    });
  }

  private onCustomErrorListener(): void {
    this.gameService.onCustomError().subscribe((data) => {
      this.snackBar.open(data.message, 'x', { duration: 3000 });
    });
  }

}
