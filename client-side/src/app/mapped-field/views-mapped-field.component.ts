import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IMappedField } from '../metadata'

@Component({
  selector: 'app-views-mapped-field',
  templateUrl: './views-mapped-field.component.html',
  styleUrls: ['./views-mapped-field.component.scss']
})
export class ViewsMappedFieldComponent implements OnInit {
  @Input() mappedField: IMappedField
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
