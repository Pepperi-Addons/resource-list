import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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
    isInitialized: boolean = false
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(
      private genericResourceService: GenericResourceOfflineService
      ) {}
    ngOnInit(): void {
      if(this.isInitialized){
        return
      }
      this.accountUUID = this.hostObject.pageParameters?.AccountUUID
      this.loadGenericView(this.hostObject)
      this.isInitialized = true
    }
    async loadGenericView(hostObject){
      if(hostObject?.configuration?.viewsList?.length == 0){
        this.hasViewToDisplay = false
        return
      }
      this.setConfigurationObject(hostObject)
      if(this.configurationObject.viewsList.length > 0){
        this.genericViewer = hostObject?.configuration?.GenericView || await this.genericResourceService.getGenericView(this.configurationObject.viewsList[0].key, this.accountUUID)
        this.genericViewer.title = this.configurationObject.viewsList[0].value;
        this.genericViewerDataSource = new RegularGVDataSource(this.genericViewer, this.genericResourceService, [], this.accountUUID)
        this.genericViewerDataSource.setFields(hostObject.configuration?.ResourceScheme?.Fields || {});
        this.hasViewToDisplay = true
      }
    }
    createDropDownOfViews(viewsList){
      return viewsList.filter(card => card.selectedView).map(card => {
        return {
          key: card.selectedView.key,
          value: card.title
        }
      })
    }
    setConfigurationObject(hostObject): void{
      this.configurationObject = {
        viewsList: this.createDropDownOfViews(hostObject?.configuration?.viewsList || []),
        items: hostObject.configuration?.Items
      }
    } 
    ngOnChanges(e: SimpleChanges): void {
      this.isInitialized = true
      this.accountUUID = this.hostObject.pageParameters?.AccountUUID
      this.loadGenericView(e.hostObject.currentValue)
    }
    onDonePressed(numOfSelectedRows: number){
      //will be implemented in the future      
    }
}
