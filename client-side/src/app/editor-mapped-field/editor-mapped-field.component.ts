import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IEditorMappedField } from '../metadata';

@Component({
  selector: 'app-editor-mapped-field',
  templateUrl: './editor-mapped-field.component.html',
  styleUrls: ['./editor-mapped-field.component.scss']
})
export class EditorMappedFieldComponent implements OnInit {
  @Input() mappedField: IEditorMappedField
  @Output() removeClick: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }


  onDeleteMappedField(){
    this.removeClick.emit(this.mappedField.field.FieldID)
  }

}
