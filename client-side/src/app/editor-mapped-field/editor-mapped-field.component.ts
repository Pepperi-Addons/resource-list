import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IEditorMappedField, IMappedField } from '../metadata';

@Component({
  selector: 'app-editor-mapped-field',
  templateUrl: './editor-mapped-field.component.html',
  styleUrls: ['./editor-mapped-field.component.scss']
})
export class EditorMappedFieldComponent implements OnInit {
  @Input() mappedField: IEditorMappedField
  @Output() removeClick: EventEmitter<IMappedField> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }


  onDeleteMappedField($event, mappedField){
    this.removeClick.emit(mappedField.id)
  }

}
