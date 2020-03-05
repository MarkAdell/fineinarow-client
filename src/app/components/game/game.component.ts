import { MatSnackBar } from '@angular/material/snack-bar';
import { GameService } from './../../services/game.service';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  roomId: string = '';
  playerColor: 'red' | 'blue';
  gameGridArray: Cell[][] = [];
  score: Score;
  gameInProgress: boolean = true;
  winningPlayer: 'red' | 'blue';

  onUserLeaveSub: Subscription;
  onNewMoveSub: Subscription;
  onPlayerWinSub: Subscription;
  onNewGameSub: Subscription;
  onGameCancelSub: Subscription;

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    localStorage.clear();
  }

  constructor(
    private gameService: GameService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.navigateToHomeIfNotAuthorized();
    this.initPlayerInfo();
    this.initScore();
    this.initGameGridArray();
    this.onUserLeaveListener();
    this.onNewMoveListener();
    this.onPlayerWinListener();
    this.onNewGameListener();
    this.onGameCancelListener();
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

  private initScore(): void {
    this.score = {
      redPlayerScore: 0,
      bluePlayerScore: 0,
    };
  }

  private initGameGridArray(): void {
    this.gameGridArray.length = 0;
    for (let i = 0; i < 13; i++) {
      const row = Array(13).fill({ shown: false, playerColor: '' });
      this.gameGridArray.push(row);
    }
  }

  public onCellClick(row: number, col: number): void {
    if (!this.gameInProgress || this.gameGridArray[row][col].played) { return; }
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

  getShapeClasses(cell: Cell): string {
    let classes = cell.playerColor === 'blue' ? 'shape-blue' : 'shape-red';
    classes = classes + (!cell.played ? ' display-hidden' : '');
    return classes;
  }

  private getNumberOfPlayerMoves(playerColor: 'red' | 'blue'): number {
    let numerOfMoves = 0;
    for (let i = 0; i < this.gameGridArray.length; i++) {
      numerOfMoves += this.gameGridArray[i].filter(cell => (cell.played && cell.playerColor === playerColor)).length;
    }
    return numerOfMoves;
  }

  private checkWinner(gameGridArray): { isThereWinner: boolean, winnerColor?: 'red' | 'blue' | '' } {
    let sameShapeInRowCount = 0;
    for (let i = 0; i < gameGridArray.length; i++) {
      for (let y = 1; y < gameGridArray.length; y++) {
        if (this.areSimilarCells(gameGridArray[i][y], gameGridArray[i][y - 1])) {
          sameShapeInRowCount++;
          if (sameShapeInRowCount === 4) {
            console.log('winner!');
            return { isThereWinner: true, winnerColor: gameGridArray[i][y].playerColor }
          }
        } else {
          sameShapeInRowCount = 0;
        }
      }
    }

    sameShapeInRowCount = 0;
    for (let i = 0; i < gameGridArray.length; i++) {
      for (let y = 1; y < gameGridArray.length; y++) {
        if (this.areSimilarCells(gameGridArray[y][i], gameGridArray[y - 1][i])) {
          sameShapeInRowCount++;
          if (sameShapeInRowCount === 4) {
            console.log('winner!');
            return { isThereWinner: true, winnerColor: gameGridArray[y][i].playerColor };
          }
        } else {
          sameShapeInRowCount = 0;
        }
      }
    }

    sameShapeInRowCount = 0;
    for (let i = 1; i < gameGridArray.length - 3; i++) {
      for (let y = 1, j = i; j < gameGridArray.length; y++, j++) {
        if (this.areSimilarCells(gameGridArray[y][j], gameGridArray[y - 1][j - 1])) {
          sameShapeInRowCount++;
          if (sameShapeInRowCount === 4) {
            console.log('winner!');
            return { isThereWinner: true, winnerColor: gameGridArray[y][j].playerColor };
          }
        } else {
          sameShapeInRowCount = 0;
        }
      }
    }

    sameShapeInRowCount = 0;
    for (let i = 2; i < gameGridArray.length - 3; i++) {
      for (let y = i, j = 1; y < gameGridArray.length; y++, j++) {
        if (this.areSimilarCells(gameGridArray[y][j], gameGridArray[y - 1][j - 1])) {
          sameShapeInRowCount++;
          if (sameShapeInRowCount === 4) {
            console.log('winner!');
            return { isThereWinner: true, winnerColor: gameGridArray[y][j].playerColor };
          }
        } else {
          sameShapeInRowCount = 0;
        }
      }
    }

    sameShapeInRowCount = 0;
    for (let i = gameGridArray.length - 2; i > 2; i--) {
      for (let y = 1, j = i; j >= 0; y++ , j--) {
        if (this.areSimilarCells(gameGridArray[y][j], gameGridArray[y - 1][j + 1])) {
          sameShapeInRowCount++;
          if (sameShapeInRowCount === 4) {
            console.log('winner!');
            return { isThereWinner: true, winnerColor: gameGridArray[y][j].playerColor };
          }
        } else {
          sameShapeInRowCount = 0;
        }
      }
    }

    sameShapeInRowCount = 0;
    for (let i = 2; i < gameGridArray.length - 3; i++) {
      for (let y = i, j = gameGridArray.length - 2; y < gameGridArray.length; y++ , j--) {
        if (this.areSimilarCells(gameGridArray[y][j], gameGridArray[y - 1][j + 1])) {
          sameShapeInRowCount++;
          if (sameShapeInRowCount === 4) {
            console.log('winner!');
            return { isThereWinner: true, winnerColor: gameGridArray[y][j].playerColor };
          }
        } else {
          sameShapeInRowCount = 0;
        }
      }
    }
    return { isThereWinner: false };
  }

  private areSimilarCells(cell1: Cell, cell2: Cell): boolean {
    return cell1.played && cell2.played && (cell1.playerColor === cell2.playerColor);
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

  private playerWinEmitter(roomId: string, playerColor: 'red' | 'blue' | '', score: Score): void {
    this.gameService.playerWin(roomId, playerColor, score);
  }

  private newGameEmitter(roomId: string): void {
    this.gameService.newGame(roomId);
  }

  private onNewGameListener(): void {
    this.onNewGameSub = this.gameService.onNewGame().subscribe(() => {
      this.gameInProgress = true;
      this.initGameGridArray();
    });
  }

  private gameCancelEmitter(roomId: string): void {
    this.gameService.cancelGame(roomId);
  }

  private onGameCancelListener(): void {
    this.onGameCancelSub = this.gameService.onGameCancel().subscribe(() => {
      this.snackBar.open('Game canceled', 'x', { duration: 3000 });
      this.router.navigate(['/']);
    });
  }

  public buildWinnerModalTitleHTML(winningPlayer: 'red' | 'blue'): string {
    const winnigPlayerCSSColor = winningPlayer === 'red' ? '#ff0000bf' : '#2256ff';
    const modalHTML = `
      <span style="color:${winnigPlayerCSSColor}">${winningPlayer}</span>&nbsp;player won!
    `;
    return modalHTML;
  }

  private onPlayerWinListener(): void {
    this.onPlayerWinSub = this.gameService.onPlayerWin().subscribe((data) => {
      this.score = data.score;
      this.gameInProgress = false;
      this.winningPlayer = data.winningPlayer;
    });
  }

  newGameQuestionBtnClicked(newGame: boolean): void {
    if (newGame) {
      this.newGameEmitter(this.roomId);
    } else {
      this.gameCancelEmitter(this.roomId);
    }
  }

  private onNewMoveListener(): void {
    this.onNewMoveSub = this.gameService.onNewMove().subscribe((data) => {
      this.gameGridArray[data.row][data.col] = { played: true, playerColor: data.playerColor };
      if (this.playerColor === 'red') {
        const checkWinnerResult = this.checkWinner(this.gameGridArray);
        if (checkWinnerResult.isThereWinner) {
          if (checkWinnerResult.winnerColor === 'red') {
            this.score.redPlayerScore += 1;
          } else {
            this.score.bluePlayerScore += 1;
          }
          this.playerWinEmitter(this.roomId, checkWinnerResult.winnerColor, this.score);
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.onNewMoveSub) {
      this.onNewMoveSub.unsubscribe();
    }
    if (this.onUserLeaveSub) {
      this.onUserLeaveSub.unsubscribe();
    }
    if (this.onNewGameSub) {
      this.onNewGameSub.unsubscribe();
    }
    if (this.onGameCancelSub) {
      this.onGameCancelSub.unsubscribe();
    }
    if (this.onPlayerWinSub) {
      this.onPlayerWinSub.unsubscribe();
    }
  }

}

export interface Cell {
  played: boolean;
  playerColor: 'blue' | 'red';
}

export interface Score {
  bluePlayerScore: number;
  redPlayerScore: number;
}
