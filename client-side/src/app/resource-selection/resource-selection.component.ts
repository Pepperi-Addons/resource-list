import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'block-resource-selection',
  templateUrl: './resource-selection.component.html',
  styleUrls: ['./resource-selection.component.scss']
})
export class ResourceSelectionComponent implements OnInit {
  @Input() hostObject: any;
  @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
  
  constructor() { }

  ngOnInit(): void {
  }

}
