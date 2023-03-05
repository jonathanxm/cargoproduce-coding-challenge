import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit, OnChanges {

  @Input()
  message?: string;

  @Output()
  result: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void{
    if(changes["message"].currentValue !==  undefined){
      this.message = changes["message"].currentValue;
    }
  }

  cancel(): void{
    this.result.emit(false);
  }

  accept(): void{
    this.result.emit(true);
  }

}
