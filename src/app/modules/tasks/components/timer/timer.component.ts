import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { TimerData } from 'src/app/core/models/timer-data.model';
import { UIUtilsService } from 'src/app/core/services/ui/ui-utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  @HostBinding("style.--completed") completed: string = '0%';
  
  @Input()
  initialSeconds?: number;

  @Input()
  initPlayed?: boolean;

  @Output()
  onStart: EventEmitter<void> = new EventEmitter();

  @Output()
  onStop: EventEmitter<TimerData> = new EventEmitter();

  private elapsedSeconds: number;
  private timerSubs?: Subscription;
  private timeLimit: number;

  countDownTime?: string;
  running: boolean = false;

  showButton: boolean = false;

  constructor(private uiUtilsSvc: UIUtilsService) {
    this.elapsedSeconds = 0;
    this.timeLimit = environment.taskTimeLimit * 60;
  }

  ngOnInit(): void {
    if(this.initialSeconds !== undefined){
      this.elapsedSeconds = this.initialSeconds;
      this.updateSpentTime();
    }
    if(this.initPlayed !== undefined && this.initPlayed === true){
      this.toggleTimer();
    }
  }

  toggleTimer(): void{
    if(this.timerSubs === undefined){
      this.onStart.emit();
      this.running = true;
      this.timerSubs = timer(1000, 1000)
                        .subscribe( _ => 
                        {
                          this.elapsedSeconds++;
                          this.updateSpentTime();

                          if(this.elapsedSeconds === this.timeLimit){
                            this.stopTimer(true);
                          } 
                        });
    } else {
      this.stopTimer(false);
    }
  }

  getElapsedTime(): number{
    return this.elapsedSeconds;
  }

  toggleButton(): void{
    this.showButton = !this.showButton;
  }

  private updateSpentTime(): void{
    let availSeconds: number = this.timeLimit - this.elapsedSeconds;
    this.countDownTime = this.uiUtilsSvc.secondsToPlainMinutes(availSeconds);

    this.completed = (this.elapsedSeconds * 100 / this.timeLimit) + "%";
  }

  private stopTimer(timeout: boolean): void{
      this.running = false;
      this.timerSubs?.unsubscribe();
      this.timerSubs = undefined;
      this.onStop.emit({timeout: timeout, elapsedSeconds: this.elapsedSeconds});
  }

}

