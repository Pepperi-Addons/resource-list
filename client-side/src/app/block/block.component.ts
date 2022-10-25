import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IGenericViewer } from '../../../../shared/entities';
import { IGenericViewerConfigurationObject } from '../metadata';
import { GenericResourceService } from '../services/generic-resource-service';
@Component({
    selector: 'block',
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
    @Input() hostObject: any;
    genericViewer: IGenericViewer
    configurationObject: IGenericViewerConfigurationObject = {
      resource: undefined,
      viewsList: [],
    }
    hasViewToDisplay: boolean = false
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private genericResourceService: GenericResourceService) {}
    ngOnInit(): void {
      this.loadGenericView(this.hostObject)
    }
    async loadGenericView(hostObject){
      if(hostObject?.configuration?.viewsList?.length == 0){
        this.hasViewToDisplay = false
        return
      }
      this.setConfigurationObject(hostObject)
      this.genericViewer = await this.genericResourceService.getGenericView(this.configurationObject.viewsList[0].key)
      this.hasViewToDisplay = true
    }
    createDropDownOfViews(viewsList){
      return viewsList.map(card => {
        return {
          key: card.selectedView.key,
          value: card.selectedView.value
        }
      })
    }
    setConfigurationObject(hostObject): void{
      this.configurationObject = {
        resource: hostObject?.configuration?.resource,
        viewsList: this.createDropDownOfViews(hostObject?.configuration?.viewsList || []),
      }
    } 
    ngOnChanges(e: any): void {
      this.loadGenericView(e.hostObject.currentValue)
    }
    onDonePressed(numOfSelectedRows: number){
      //will be implemented in the future      
    }
}
