import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IGenericViewerConfigurationObject } from '../metadata';
@Component({
    selector: 'block',
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
    @Input() hostObject: any;
    configurationObject: IGenericViewerConfigurationObject = {
      resource: undefined,
      viewsList: []
    }
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor() {}
    ngOnInit(): void {
      this.configurationObject = {
        resource: this.hostObject?.configuration?.resource,
        viewsList: this.hostObject?.configuration?.viewsList || []
      }
    } 
    ngOnChanges(e: any): void {
      this.configurationObject = {
        resource: e?.configuration?.resource,
        viewsList: e?.configuration?.viewsList || []
      }
    }
}
