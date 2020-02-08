import { GameService } from './../../services/game.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  gameGridArray: Cell[][] = [];

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.initGameGridArray();
  }

  private initGameGridArray(): void {
    this.gameGridArray.length = 0;
    for (let i = 0; i < 15; i++) {
      const row = Array(15).fill({ shown: false, shape: '' });
      this.gameGridArray.push(row);
    }
  }

  // red only plays if red shapes are equal to blue, blue only plays if red shapes are higher than blue by one
  public onCellClick(i, y): void {
    this.gameGridArray[i][y] = { played: true, shape: 'blue' };
    this.checkWinner();
  }

  public getShapeClasses(cell: Cell): string {
    let classes = cell.shape === 'blue' ? 'shape-blue' : 'shape-red';
    classes = classes + (!cell.played ? ' hidden' : '');
    return classes;
  }

  private getNumberOfPlayerMoves(color: 'red' | 'blue'): number {
    let numerOfMoves = 0;
    for (let i = 0; i < this.gameGridArray.length; i++) {
      numerOfMoves += this.gameGridArray[i].filter(cell => (cell.played && cell.shape === color)).length;
    }
    return numerOfMoves;
  }

  private checkWinner(): void {
    let sameShapeInRowCount = 0;
    for (let i = 0; i < this.gameGridArray.length; i++) {
      for (let y = 1; y < this.gameGridArray.length; y++) {
        // console.log(this.gameGridArray[i][y]);
        if (this.areSimilarCells(this.gameGridArray[i][y], this.gameGridArray[i][y - 1])) {
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
    for (let i = 0; i < this.gameGridArray.length; i++) {
      for (let y = 1; y < this.gameGridArray.length; y++) {
        // console.log(this.gameGridArray[y][i]);
        if (this.areSimilarCells(this.gameGridArray[y][i], this.gameGridArray[y - 1][i])) {
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
    for (let i = 1; i < this.gameGridArray.length - 3; i++) {
      for (let y = 1, j = i; j < this.gameGridArray.length; y++, j++) {
        // console.log(this.gameGridArray[y][j]);
        if (this.areSimilarCells(this.gameGridArray[y][j], this.gameGridArray[y - 1][j - 1])) {
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
    for (let i = 2; i < this.gameGridArray.length - 3; i++) {
      for (let y = i, j = 1; y < this.gameGridArray.length; y++, j++) {
        // console.log(this.gameGridArray[y][j]);
        if (this.areSimilarCells(this.gameGridArray[y][j], this.gameGridArray[y - 1][j - 1])) {
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
    for (let i = this.gameGridArray.length - 2; i > 2; i--) {
      for (let y = 1, j = i; j >= 0; y++ , j--) {
        // console.log(this.gameGridArray[y][j]);
        if (this.areSimilarCells(this.gameGridArray[y][j], this.gameGridArray[y - 1][j + 1])) {
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
    for (let i = 2; i < this.gameGridArray.length - 3; i++) {
      for (let y = i, j = this.gameGridArray.length - 2; y < this.gameGridArray.length; y++ , j--) {
        // console.log(this.gameGridArray[y][j]);
        if (this.areSimilarCells(this.gameGridArray[y][j], this.gameGridArray[y - 1][j + 1])) {
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

}

export interface Cell {
  played: boolean;
  shape: 'blue' | 'red';
}
