import { Component, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from "rxjs";
import {Times} from './times.interface';
import { TimeService } from "./timer.service";
import { take, tap} from "rxjs/operators";

@Component({
  selector: "app-mainpage",
  templateUrl: "./mainpage.component.html",
  styleUrls: ["./mainpage.component.scss"]
})
export class MainpageComponent implements OnDestroy {
  public times: Times = {seconds: '0', minutes: '0'};
  private sub: Subscription = new Subscription();
  private subDbClick: Subscription = new Subscription();
  public startBtn = true;
  
  @ViewChild('dbClick') dbClick!: ElementRef

  constructor(private timerService: TimeService) {

    this.sub.add(
      this.timerService.times$.subscribe(
        (val: Times) => (this.times = val)
      )
    );
  }
  public startCount(): void {
    this.startBtn = !this.startBtn;
    this.timerService.startCount();
  }

  public waitTimer(): void {
    this.timerService.stopTimer();
    this.startBtn = !this.startBtn;
  }

  public resetTimer(): void {
    this.timerService.resetTimer();
    this.timerService.startCount();
  }

  public stopTimer(): void {
    this.startBtn = true;
    this.timerService.resetTimer();
  }

  public dbClickCheck(): void {
    let lastClicked = 0;
    this.subDbClick = fromEvent(this.dbClick.nativeElement, 'click').pipe(take(2), tap(v => {
      const timeNow = new Date().getTime();
      if (timeNow < (lastClicked + 500)) this.waitTimer();
      lastClicked = timeNow;
    })).subscribe();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.subDbClick.unsubscribe();
  }

}
