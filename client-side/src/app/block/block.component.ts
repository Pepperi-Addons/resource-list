import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IGenericViewer } from '../../../../shared/entities';
import { RegularGVDataSource } from '../generic-viewer-data-source';
import { IGenericViewerConfigurationObject } from '../metadata';
import { GenericResourceService } from '../services/generic-resource-service';
import { UtilitiesService } from '../services/utilities-service';
@Component({
    selector: 'block',
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
    @Input() hostObject: any;
    genericViewer: IGenericViewer
    // itemsHandler: IItemsHandler
    configurationObject: IGenericViewerConfigurationObject = {
      resource: undefined,
      viewsList: [],
    }
    hasViewToDisplay: boolean = false
    genericViewerDataSource: RegularGVDataSource
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(
      private genericResourceService: GenericResourceService,
      private utilitiesService: UtilitiesService) {}
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
      this.genericViewerDataSource = new RegularGVDataSource(this.genericViewer, this.genericResourceService)
      // this.itemsHandler = {
      //   getItems:  async (resourceName, getDeletedItems) => {
      //     let query = undefined
      //     if(getDeletedItems){
      //         query = {where: 'Hidden=true'}
      //         query.include_deleted = true
      //     }
      //     if(resourceName){
      //         return await this.utilitiesService.papiClient.resources.resource(resourceName).get(query)
      //     }
      //     return [];
      //   },
      //   postItem: async (resourceName, item) => {
      //     return await this.utilitiesService.papiClient.resources.resource(resourceName).post(item)
      //   }
      // }
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
