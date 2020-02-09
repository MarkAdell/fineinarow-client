import { MatSnackBar } from '@angular/material/snack-bar';
import { GameService } from './../../services/game.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  roomId: string = '';
  playerColor: 'red' | 'blue';
  gameGridArray: Cell[][] = [];

  onNewMoveSub: Subscription;
  onUserLeaveSub: Subscription;

  constructor(
    private gameService: GameService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.navigateToHomeIfNotAuthorized();
    this.initPlayerInfo();
    this.initGameGridArray();
    this.onUserLeaveListener();
    this.onNewMoveListener();
  }

  private navigateToHomeIfNotAuthorized(): void {
    if (!localStorage.getItem('joinedRoomID') || !localStorage.getItem('player')) {
      this.router.navigate(['/']);
    }
  }

  private initPlayerInfo(): void {
    this.roomId = localStorage.getItem('joinedRoomID');
    this.playerColor = <'red' | 'blue'>localStorage.getItem('player');
  }

  private initGameGridArray(): void {
    this.gameGridArray.length = 0;
    for (let i = 0; i < 15; i++) {
      const row = Array(15).fill({ shown: false, shape: '' });
      this.gameGridArray.push(row);
    }
  }

  public onCellClick(row: number, col: number): void {
    if (this.gameGridArray[row][col].played) { return; }
    const redMovesCount = this.getNumberOfPlayerMoves('red');
    const blueMovesCount = this.getNumberOfPlayerMoves('blue');
    if (this.isPlayerTurn(this.playerColor, redMovesCount, blueMovesCount)) {
      this.makeMoveEmitter(this.roomId, this.playerColor, row, col)
    }
  }

  private isPlayerTurn(playerColor: string, redMovesCount: number, blueMovesCount: number) {
    return (playerColor === 'red' && redMovesCount === blueMovesCount)
        || (playerColor === 'blue' && redMovesCount - blueMovesCount === 1);
  }

  public getShapeClasses(cell: Cell): string {
    let classes = cell.shape === 'blue' ? 'shape-blue' : 'shape-red';
    classes = classes + (!cell.played ? ' hidden' : '');
    return classes;
  }

  private getNumberOfPlayerMoves(playerColor: 'red' | 'blue'): number {
    let numerOfMoves = 0;
    for (let i = 0; i < this.gameGridArray.length; i++) {
      numerOfMoves += this.gameGridArray[i].filter(cell => (cell.played && cell.shape === playerColor)).length;
    }
    return numerOfMoves;
  }

  private checkWinner(gameGridArray): void {
    let sameShapeInRowCount = 0;
    for (let i = 0; i < gameGridArray.length; i++) {
      for (let y = 1; y < gameGridArray.length; y++) {
        // console.log(this.gameGridArray[i][y]);
        if (this.areSimilarCells(gameGridArray[i][y], gameGridArray[i][y - 1])) {
          sameShapeInRowCount++;
          if (sameShapeInRowCount === 4) {
            console.log('winner!');
          }
        } else {
          sameShapeInRowCount = 0;
        }
      }
    }

    sameShapeInRowCount = 0;
    for (let i = 0; i < gameGridArray.length; i++) {
      for (let y = 1; y < gameGridArray.length; y++) {
        // console.log(this.gameGridArray[y][i]);
        if (this.areSimilarCells(gameGridArray[y][i], gameGridArray[y - 1][i])) {
          sameShapeInRowCount++;
          if (sameShapeInRowCount === 4) {
            console.log('winner!');
          }
        } else {
          sameShapeInRowCount = 0;
        }
      }
    }

    sameShapeInRowCount = 0;
    for (let i = 1; i < gameGridArray.length - 3; i++) {
      for (let y = 1, j = i; j < gameGridArray.length; y++, j++) {
        // console.log(this.gameGridArray[y][j]);
        if (this.areSimilarCells(gameGridArray[y][j], gameGridArray[y - 1][j - 1])) {
          sameShapeInRowCount++;
          if (sameShapeInRowCount === 4) {
            console.log('winner!');
          }
        } else {
          sameShapeInRowCount = 0;
        }
      }
    }

    sameShapeInRowCount = 0;
    for (let i = 2; i < gameGridArray.length - 3; i++) {
      for (let y = i, j = 1; y < gameGridArray.length; y++, j++) {
        // console.log(this.gameGridArray[y][j]);
        if (this.areSimilarCells(gameGridArray[y][j], gameGridArray[y - 1][j - 1])) {
          sameShapeInRowCount++;
          if (sameShapeInRowCount === 4) {
            console.log('winner!');
          }
        } else {
          sameShapeInRowCount = 0;
        }
      }
    }

    sameShapeInRowCount = 0;
    for (let i = gameGridArray.length - 2; i > 2; i--) {
      for (let y = 1, j = i; j >= 0; y++ , j--) {
        // console.log(this.gameGridArray[y][j]);
        if (this.areSimilarCells(gameGridArray[y][j], gameGridArray[y - 1][j + 1])) {
          sameShapeInRowCount++;
          if (sameShapeInRowCount === 4) {
            console.log('winner!');
          }
        } else {
          sameShapeInRowCount = 0;
        }
      }
    }

    sameShapeInRowCount = 0;
    for (let i = 2; i < gameGridArray.length - 3; i++) {
      for (let y = i, j = gameGridArray.length - 2; y < gameGridArray.length; y++ , j--) {
        // console.log(this.gameGridArray[y][j]);
        if (this.areSimilarCells(gameGridArray[y][j], gameGridArray[y - 1][j + 1])) {
          sameShapeInRowCount++;
          if (sameShapeInRowCount === 4) {
            console.log('winner!');
          }
        } else {
          sameShapeInRowCount = 0;
        }
      }
    }
  }

  private areSimilarCells(cell1: Cell, cell2: Cell): boolean {
    return cell1.played && cell2.played && (cell1.shape === cell2.shape);
  }

  private onUserLeaveListener(): void {
    this.onUserLeaveSub = this.gameService.onUserLeave().subscribe(() => {
      this.snackBar.open('The other player left', 'x', { duration: 3000 });
      this.router.navigate(['/']);
    });
  }

  private makeMoveEmitter(roomId: string, playerColor: 'red' | 'blue', row: number, col: number): void {
    this.gameService.makeMove(roomId, playerColor, row, col);
  }

  private onNewMoveListener(): void {
    this.onNewMoveSub = this.gameService.onNewMove().subscribe((data) => {
      this.gameGridArray[data.row][data.col] = { played: true, shape: data.playerColor };
      this.checkWinner(this.gameGridArray);
    });
  }

  ngOnDestroy() {
    if (this.onNewMoveSub) {
      this.onNewMoveSub.unsubscribe();
    }
    if (this.onUserLeaveSub) {
      this.onUserLeaveSub.unsubscribe();
    }
  }

}

export interface Cell {
  played: boolean;
  shape: 'blue' | 'red';
}
