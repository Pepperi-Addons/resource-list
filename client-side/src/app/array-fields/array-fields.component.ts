
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'array-fields',
  templateUrl: './array-fields.component.html',
  styleUrls: ['./array-fields.component.scss']
})
export class ArrayFieldsComponent implements OnInit {
  @Input() dataViewOfArrayField: any
  @Input() dataSource: any
  @Input() referenceFields
  constructor() { }

  ngOnInit(): void {
  }
}
