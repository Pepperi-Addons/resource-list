import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IMappedField, IViewMappedField } from '../metadata'

@Component({
  selector: 'app-mapped-field',
  templateUrl: './mapped-field.component.html',
  styleUrls: ['./mapped-field.component.scss']
})
export class MappedFieldComponent implements OnInit {
  @Input() mappedField: IViewMappedField
  @Output() removeClick: EventEmitter<string> = new EventEmitter();
  width: number
  constructor() { }

  ngOnInit(): void {
  }
  onDeleteMappedField(){
    this.removeClick.emit(this.mappedField.field.FieldID)
  }
  
  onWidthChange($event){
    this.mappedField.width = Number($event)
  }
}
