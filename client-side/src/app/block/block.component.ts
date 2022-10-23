import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IGenericViewerConfigurationObject } from '../metadata';
import { GenericResourceService } from '../services/generic-resource-service';
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
      genericViewer: undefined
    }
    hasViewToDisplay: boolean = false
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    //get the views list and the resource from the host object
    //get the generic view of the first view in the views list
    //send it to the generic viewer component
    constructor(private  genericResourceService: GenericResourceService) {}
    ngOnInit(): void {
      this.loadGenericView(this.hostObject)
    }
    async loadGenericView(hostObject){
      if(hostObject?.configuration?.viewsList?.length == 0 || !hostObject.configuration?.resource){
        console.dir(hostObject.configuration)
        this.hasViewToDisplay = false
        return
      }
      this.hasViewToDisplay = true
      this.configurationObject = await this.createConfigurationObject(hostObject)
      //get the generic view
      // this.setConfigurationObject(resource, dropDownOfViews, genericView)
    }
    async createConfigurationObject(hostObject): Promise<IGenericViewerConfigurationObject>{
      const resource = hostObject.configuration.resource 
      const dropDownOfViews = this.createDropDownOfViews(hostObject.configuration.viewsList)
      const genericView = await this.genericResourceService.getGenericView(dropDownOfViews[0].key)
      debugger
      return {
        resource: resource,
        viewsList: dropDownOfViews,
        genericViewer: genericView
      }
    }
    createDropDownOfViews(viewsList){
      return viewsList.map(card => {
        return {
          key: card.selectedView.key,
          value: card.selectedView.value
        }
      })
    }
    // setConfigurationObject(hostObject): void{
    //   this.configurationObject = {
    //     resource: hostObject?.configuration?.resource,
    //     viewsList: this.createDropDownOfViews(hostObject?.configuration?.viewsList || []),
    //   }
    // } 
    ngOnChanges(e: any): void {
      this.loadGenericView(e.hostObject.currentValue)
    }
    onDonePressed(numOfSelectedRows: number){
      //will be implemented in the future      
    }
}
