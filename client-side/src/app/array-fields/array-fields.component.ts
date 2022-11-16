
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'array-fields',
  templateUrl: './array-fields.component.html',
  styleUrls: ['./array-fields.component.scss']
})
export class ArrayFieldsComponent implements OnInit {
  @Input() dataViewOfArrayField: any
  @Input() dataSource: any
  @Input() referenceFields
  @Input() resourceName: string
  @Input() originalValue: any
  @Input() event: BehaviorSubject<any>
  constructor() { }

  ngOnInit(): void {
  }
}
