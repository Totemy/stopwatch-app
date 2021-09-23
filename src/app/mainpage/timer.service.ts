import { Injectable } from "@angular/core";
import { Observable, timer, BehaviorSubject, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { Times } from "./times.interface";

@Injectable({
  providedIn: "root"
})
export class TimeService {
  private readonly initialTime = 0;

  private timer$: BehaviorSubject<number> = new BehaviorSubject(
    this.initialTime
  );
  private lastStopedTime: number = this.initialTime;
  private timerSub: Subscription = new Subscription();
  private isRunning: boolean = false;
  private interval = 0;

  constructor() {}

  public get times$(): Observable<Times> {
    return this.timer$.pipe(
      map((seconds: number): Times => this.secondsToStopWatch(seconds))
    );
  }

  startCount(): void {
    if (this.isRunning) {
      return;
    }
    this.timerSub = timer(0, 1000).pipe(map((value: number): number => value + this.lastStopedTime)).subscribe(this.timer$);
    this.isRunning = true;
  }

  stopTimer(): void {
    this.lastStopedTime = this.timer$.value;
    this.timerSub.unsubscribe();
    this.isRunning = false;
  }

  resetTimer(): void {
    this.timerSub.unsubscribe();
    this.lastStopedTime = this.initialTime;
    this.timer$.next(this.initialTime);
    this.isRunning = false;
  }

  private secondsToStopWatch(ss: number): Times {
    let seconds =  ss % 60;
    if(ss % 60 === 0) this.interval = Math.floor(ss / 60);
    const minutes = Math.floor(ss / 60);
    return {
      minutes: this.convertToNumberString(minutes),
      seconds: this.convertToNumberString(seconds),
    };
  }

  private convertToNumberString(value: number): string {
    return `${value < 10 ? "0" + value : value}`;
  }
}
