import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPepOption } from '@pepperi-addons/ngx-lib';
import { IMappedField } from '../views-editor/views-editor.component';

@Component({
  selector: 'app-mapped-field',
  templateUrl: './mapped-field.component.html',
  styleUrls: ['./mapped-field.component.scss']
})
export class MappedFieldComponent implements OnInit {
  @Input() mappedField: IMappedField
  @Output() removeClick: EventEmitter<IMappedField> = new EventEmitter();
  resourceField: string
  constructor() { }

  ngOnInit(): void {
  }
  onDeleteMappedField($event, mappedField){
    this.removeClick.emit(mappedField.id)
  }

}
