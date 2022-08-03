import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IMappedField } from '../metadata';

@Component({
  selector: 'app-menu-mapped-field',
  templateUrl: './menu-mapped-field.component.html',
  styleUrls: ['./menu-mapped-field.component.scss']
})
export class MenuMappedFieldComponent implements OnInit {

  @Input() mappedField: IMappedField
  @Output() removeClick: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
  onDeleteMappedField(){
    this.removeClick.emit(this.mappedField.field.FieldID)
  }
}
