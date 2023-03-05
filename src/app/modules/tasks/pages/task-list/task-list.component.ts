import { Component, OnInit } from '@angular/core';
import { TaskListTexts } from 'src/app/core/constants/task-list-texts';
import { TaskState } from 'src/app/core/enums/task-state.enum';
import { TaskStateChangedData } from 'src/app/core/models/task-state-changed-data';
import { Task } from 'src/app/core/models/task.model';
import { TasksService } from 'src/app/core/services/api/tasks.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  tasksData: Task[] = [];
  editingTask?: Task;
  showTaskEditor: boolean = false;
  apiWorking: boolean = false;

  showConfirmDialog: boolean = false;
  currentConfirmMsg?: string = "";
  currentConifrmCB?: Function;

  constructor(private tasksSvc: TasksService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void{
    this.apiWorking = true;
    this.tasksSvc.getTasks().subscribe(res => {
      this.tasksData = res;
      this.apiWorking = false;
    });
  }

  newTask(): void{
    this.toogleTaskEditor(true);
  }

  deleteTask(task: Task): void{
    if(task.title !== undefined){
      this.showConfirm(TaskListTexts.CONFIRMDELETE.replace("{task}", task.title), () => {
        this.apiWorking = true;
        this.tasksSvc.deleteTask(task).subscribe(_ => {
          this.apiWorking = false;
          this.loadTasks();
        });
      });
    }
  }

  updateTask(task: Task): void{
    this.editingTask = task;
    this.toogleTaskEditor(true);
  }

  taskStateChanged(task: Task, stateData: TaskStateChangedData, confirmed?: boolean): void{

    if(stateData.newState == TaskState.Done && !confirmed){
      if(task.title !== undefined){
        this.showConfirm(TaskListTexts.CONFIRMDONE.replace("{task}", task.title), () => this.taskStateChanged(task, stateData, true));
      }
      return;
    }

    task.state = stateData.newState;

    if(stateData.newState == TaskState.InProgress){
      task.lastStartDate = new Date();
    }

    if(stateData.timerData !== undefined){
      task.spentTime = stateData.timerData.elapsedSeconds;
    }
    
    this.saveTask(task);
  }

  taskSaved(task: Task): void{
    this.resetEditor();
    this.saveTask(task);
    this.toogleTaskEditor(false);
  }

  toogleTaskEditor(show: boolean): void{
    this.showTaskEditor = show;
  }

  editorClosed(): void{
    this.resetEditor();
    this.toogleTaskEditor(false);
  }

  showConfirm(msg: string, cb: Function): void{
    this.currentConfirmMsg = msg;
    this.currentConifrmCB = cb;
    this.showConfirmDialog = true;
  }

  dialogResult(result: boolean): void{
    if(result){
      if(this.currentConifrmCB !== undefined){
        this.currentConifrmCB();
        this.closeDialog();
      }
    } else {
      this.closeDialog();
    }
  }

  private closeDialog(): void{
    this.currentConfirmMsg = undefined;
    this.currentConifrmCB = undefined;
    this.showConfirmDialog = false;
  }

  private resetEditor(): void{
    this.editingTask = undefined;
  }

  private saveTask(task: Task): void{
    this.apiWorking = true;
    if(task.id == undefined){
      this.tasksSvc.addTask(task).subscribe(_ => {
        this.loadTasks();
        this.apiWorking = false;
      });
    } else {
      this.tasksSvc.updateTask(task).subscribe(_ => this.apiWorking = false);
    }
  }

}
