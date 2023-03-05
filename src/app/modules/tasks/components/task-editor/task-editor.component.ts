import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskState } from 'src/app/core/enums/task-state.enum';
import { Task } from 'src/app/core/models/task.model';

@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrls: ['./task-editor.component.scss']
})
export class TaskEditorComponent implements OnInit, OnChanges {

  @Input()
  initTask?: Task;

  @Output()
  onSave: EventEmitter<Task> = new EventEmitter();

  @Output()
  onCancel: EventEmitter<void> = new EventEmitter();

  taskForm: FormGroup = this.fb.group(
    {
      id: [""],
      title: ["", Validators.required],
      description: [""]
    }
  );

  private editingTask: Task = {};

  constructor(private fb: FormBuilder) {
    
  }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void{
    if(changes["initTask"].currentValue !==  undefined){
      this.editingTask = changes["initTask"].currentValue;
      if(this.editingTask !== undefined){
        this.taskForm.patchValue(this.editingTask);
      }
    }
  }

  cancel(): void{
    this.onCancel.emit();
    this.resetEditor();
  }

  onSubmit(): void{
    this.editingTask.title = this.taskForm.get("title")?.value;
    this.editingTask.description = this.taskForm.get("description")?.value;

    if(this.editingTask.id === undefined){
      this.editingTask.date = new Date();
      this.editingTask.state = TaskState.Pending;
    }

    this.onSave.emit(this.editingTask);

    this.resetEditor();
  }

  isEditMode(): boolean{
    return this.editingTask.id !== undefined;
  }

  private resetEditor(): void{
    this.editingTask = {};
    this.initTask = undefined;
    this.taskForm.reset();
  }

}
