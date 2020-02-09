import { GameService } from './../../services/game.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.userLeaveEmitter();
    localStorage.clear();
  }

  private userLeaveEmitter(): void {
    this.gameService.userLeave();
  }

}
