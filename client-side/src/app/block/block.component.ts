import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IGenericViewer } from 'shared';
import { RegularGVDataSource } from '../generic-viewer-data-source';
import { IGenericViewerConfigurationObject } from '../metadata';
import { GenericResourceOfflineService } from '../services/generic-resource-offline.service';
@Component({
    selector: 'block',
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
    @Input() hostObject: any;
    genericViewer: IGenericViewer
    configurationObject: IGenericViewerConfigurationObject = {
      viewsList: [],
    }
    hasViewToDisplay: boolean = false
    genericViewerDataSource: RegularGVDataSource
    accountUUID: string | undefined
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(
      private genericResourceService: GenericResourceOfflineService
      ) {}
    ngOnInit(): void {
      this.accountUUID = this.hostObject.pageParameters?.AccountUUID
      this.loadGenericView(this.hostObject)
    }
    async loadGenericView(hostObject){
      if(hostObject?.configuration?.viewsList?.length == 0){
        this.hasViewToDisplay = false
        return
      }
      this.setConfigurationObject(hostObject)
      if(this.configurationObject.viewsList.length > 0){
        this.genericViewer = await this.genericResourceService.getGenericView(this.configurationObject.viewsList[0].key)
        this.genericViewerDataSource = new RegularGVDataSource(this.genericViewer, this.genericResourceService, [], this.accountUUID)
        this.hasViewToDisplay = true
      }
    }
    createDropDownOfViews(viewsList){
      return viewsList.filter(card => card.selectedView).map(card => {
        return {
          key: card.selectedView.key,
          value: card.selectedView.value
        }
      })
    }
    setConfigurationObject(hostObject): void{
      this.configurationObject = {
        viewsList: this.createDropDownOfViews(hostObject?.configuration?.viewsList || []),
      }
    } 
    ngOnChanges(e: any): void {
      this.accountUUID = this.hostObject.pageParameters?.AccountUUID
      this.loadGenericView(e.hostObject.currentValue)
    }
    onDonePressed(numOfSelectedRows: number){
      //will be implemented in the future      
    }
}
