import { Component, Input, OnInit } from '@angular/core';
import { AvailableField } from 'shared';

@Component({
  selector: 'variables-mapping',
  templateUrl: './variables-mapping.component.html',
  styleUrls: ['./variables-mapping.component.scss']
})
export class VariablesMappingComponent implements OnInit {
  @Input() variablesArray: AvailableField[] = []

  constructor() { }

  ngOnInit(): void {
    
  }

}
