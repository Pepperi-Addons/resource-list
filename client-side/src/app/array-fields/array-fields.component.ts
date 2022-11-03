
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'array-fields',
  templateUrl: './array-fields.component.html',
  styleUrls: ['./array-fields.component.scss']
})
export class ArrayFieldsComponent implements OnInit {
  @Input() dataViewOfArrayField: any
  @Input() dataSource: any
  title: string = "" 

  //outputs bridge between specific array fields components and field editor
  @Output() editEvent: EventEmitter<any> = new EventEmitter<any>()
  @Output() addEvent: EventEmitter<any> = new EventEmitter<any>()
  @Output() deleteEvent: EventEmitter<any> = new EventEmitter<any>()
  
  constructor() { }

  ngOnInit(): void {
  }

  //bridge functions
  onAddItemToArrayEvent(data: any){
    this.addEvent.emit(data)
  }
  onEditItemInArrayEvent(data: any){
    this.editEvent.emit(data)
  }
  onDeleteItemInArrayEvent(data: any){
    this.deleteEvent.emit(data)
  }

}
