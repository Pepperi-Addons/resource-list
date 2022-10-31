
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'array-fields',
  templateUrl: './array-fields.component.html',
  styleUrls: ['./array-fields.component.scss']
})
export class ArrayFieldsComponent implements OnInit {
  @Input() dataViewOfArrayField: any
  @Input() dataSource: any
  title: string = "" 
  constructor() { }

  ngOnInit(): void {
    
  }
  onAddClick(){

  }

}
