import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IMappedField } from '../metadata'

@Component({
  selector: 'app-mapped-field',
  templateUrl: './mapped-field.component.html',
  styleUrls: ['./mapped-field.component.scss']
})
export class MappedFieldComponent implements OnInit {
  @Input() mappedField: IMappedField
  @Output() removeClick: EventEmitter<IMappedField> = new EventEmitter();
  width: number
  constructor() { }

  ngOnInit(): void {
  }
  onDeleteMappedField($event, mappedField){
    this.removeClick.emit(mappedField.id)
  }
  
  onWidthChange($event){
    this.mappedField.width = Number($event)
  }
}
