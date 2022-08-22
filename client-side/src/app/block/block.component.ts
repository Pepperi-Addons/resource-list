import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
      viewsList: [],
    }
    hasViewToDisplay: boolean = false
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor() {}
    ngOnInit(): void {
      this.loadGenericView(this.hostObject)
    }
    loadGenericView(hostObject){
      if(hostObject?.configuration?.viewsList?.length == 0){
        this.hasViewToDisplay = false
        return
      }
      this.hasViewToDisplay = true
      this.setConfigurationObject(hostObject)
    }
    setConfigurationObject(hostObject): void{
      this.configurationObject = {
        resource: hostObject?.configuration?.resource,
        viewsList: hostObject?.configuration?.viewsList || [],
      }
    } 
    ngOnChanges(e: any): void {
      this.loadGenericView(e.hostObject.currentValue)
    }
    onDonePressed(numOfSelectedRows: number){
      //will be implemented in the future      
    }
}
