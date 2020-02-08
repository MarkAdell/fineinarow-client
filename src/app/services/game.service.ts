import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiURL = 'http://localhost:3000';
  private socket: SocketIOClient.Socket;

  constructor() {
    console.log('hi');
    this.socket = io(this.apiURL);
  }

  public createRoom(): void {
    this.socket.emit('new room');
  }

  public joinRoom(roomId): void {
    this.socket.emit('join room', { roomId });
  }

  public makeMove(roomId: string, row: number, col: number): void {
    this.socket.emit('new move', { roomId, row, col });
  }

  public playerWon(roomId: string, winningPlayer: string): void {
    this.socket.emit('player win', { roomId, winningPlayer });
  }

  public newGame(roomId: string): void {
    this.socket.emit('new game', { roomId });
  }

  public cancelGame(roomId: string): void {
    this.socket.emit('game cancel', { roomId });
  }

  public onRoomJoined(): Observable<any> {
    return Observable.create((observable) => {
      this.socket.on('room joined', (data: { roomId: string }) => {
        observable.next(data);
      });
    });
  }

  public onGameStart(): Observable<any> {
    return Observable.create((observable) => {
      this.socket.on('room joined', () => {
        observable.next();
      });
    });
  }

  public onNewMove(): Observable<any> {
    return Observable.create((observable) => {
      this.socket.on('new move', (data: { row: number, col: number }) => {
        observable.next(data);
      });
    });
  }

  public onPlayerWin(): Observable<any> {
    return Observable.create((observable) => {
      this.socket.on('player win', (data: { winningPlayer: string }) => {
        observable.next(data);
      });
    });
  }

  public onNewGame(): Observable<any> {
    return Observable.create((observable) => {
      this.socket.on('new game', () => {
        observable.next();
      });
    });
  }

  public onGameCancel(): Observable<any> {
    return Observable.create((observable) => {
      this.socket.on('game cancel', () => {
        observable.next();
      });
    });
  }

  public onUserLeave(): Observable<any> {
    return Observable.create((observable) => {
      this.socket.on('user leave', () => {
        observable.next();
      });
    });
  }

  public onCustomError(): Observable<any> {
    return Observable.create((observable) => {
      this.socket.on('custom error', (data: { message: string }) => {
        observable.next(data);
      });
    });
  }

}
