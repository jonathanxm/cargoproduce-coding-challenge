import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TaskStateTexts } from 'src/app/core/constants/task-state-texts';
import { TaskState } from 'src/app/core/enums/task-state.enum';
import { TaskStateChangedData } from 'src/app/core/models/task-state-changed-data';
import { Task } from 'src/app/core/models/task.model';
import { TimerData } from 'src/app/core/models/timer-data.model';
import { UIUtilsService } from 'src/app/core/services/ui/ui-utils.service';
import { TimerComponent } from '../timer/timer.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  @ViewChild("timer") timer!: TimerComponent;

  @Input()
  data?: Task; 

  @Output()
  onDelete: EventEmitter<void> = new EventEmitter();

  @Output()
  onUpdate: EventEmitter<void> = new EventEmitter();

  @Output()
  onStateChanged: EventEmitter<TaskStateChangedData> = new EventEmitter();

  initPlayed: boolean;

  constructor(private uiUtilsSvc: UIUtilsService) { 
    this.initPlayed = false;
  }

  ngOnInit(): void {
    this.initPlayed = this.data?.state == TaskState.InProgress;
  }

  delete(): void{
    this.onDelete.emit();
  }

  update(): void{
    this.onUpdate.emit();
  }

  done(): void{
    this.fireStateChanged(TaskState.Done, {elapsedSeconds: this.timer.getElapsedTime(), timeout: false });
  }

  getStateText(): string{
    switch (this.data?.state) {
      case TaskState.Pending:
        return TaskStateTexts.PENDING;
      case TaskState.Done:
        return TaskStateTexts.DONE;
      case TaskState.InProgress:
        return TaskStateTexts.INPROGRESS;
      case TaskState.Paused:
        return TaskStateTexts.PAUSED;
      case TaskState.Timeout:
        return TaskStateTexts.TIMEOUT;
      default:
        return TaskStateTexts.UNKNOWN;
    }
  }

  getSpentTime(): string{
    if(this.data !== undefined && this.data.spentTime !== undefined){
      return this.uiUtilsSvc.secondsToPlainMinutes(this.data?.spentTime);
    }
    return "";
  }

  onTimerStart(): void{
    this.fireStateChanged(TaskState.InProgress);
  }

  onTimerStop(timerData: TimerData): void{
    this.fireStateChanged(timerData.timeout ? TaskState.Timeout : TaskState.Paused, timerData);
  }

  isRunning(): boolean{
    return  this.data?.state === TaskState.InProgress;
  }

  isActive(): boolean{
    return this.data?.state !== TaskState.Cancelled && 
              this.data?.state !== TaskState.Done && 
              this.data?.state !== TaskState.Timeout;
  }

  isCompleted(): boolean{
    return  this.data?.state === TaskState.Done;
  }

  isTimeout(): boolean{
    return  this.data?.state === TaskState.Timeout;
  }

  private fireStateChanged(newState: TaskState, timerData?: TimerData): void{
    this.onStateChanged.emit({
      newState: newState,
      timerData: timerData
    });
  }

}
