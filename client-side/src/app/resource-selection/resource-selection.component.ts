import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectOption, View } from '../../../../shared/entities';
import { IGenericViewerConfigurationObject } from '../metadata';
import { GenericResourceService } from '../services/generic-resource-service';
import { UtilitiesService } from '../services/utilities-service';
import { ViewsService } from '../services/views.service';

@Component({
  selector: 'block-resource-selection',
  templateUrl: './resource-selection.component.html',
  styleUrls: ['./resource-selection.component.scss']
})
export class ResourceSelectionComponent implements OnInit {
  @Input() hostObject: any;
  @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
  configurationObj: IGenericViewerConfigurationObject
  loadCompleted: boolean = false
  constructor(
    private viewsService: ViewsService,
    private utilitiesService: UtilitiesService
  ) { }

  ngOnInit(): void {
    this.init()
  }
  async init(){
    this.configurationObj = await this.getGenericViewerConfigurationObject()
    if(!this.configurationObj){
      //display error msg
      this.utilitiesService.showDialog('Error', 'MissingParametersHostObject', 'close')
      return 
    }
    this.loadCompleted = true
  }
  async getGenericViewerConfigurationObject(): Promise<IGenericViewerConfigurationObject | undefined>{
    if(!this.isValidHostObject()){
      return undefined
    }
    const resource = this.hostObject.resource
    const viewsDropDown = await this.getViewsDropDown()
    return {
      resource: resource,
      viewsList: viewsDropDown,
      selectionList: {
        none: this.hostObject.allowNone,
        selection: this.hostObject.selectionMode
      }
    }
  }
  async getViewsDropDown(): Promise<SelectOption[]>{
    const views = await this.getViewsArrayFromHostObject()
    if(views){
      return this.convertViewsArrayToViewsDropDown(views)
    }
    return []
  }
  convertViewsArrayToViewsDropDown(views: View[]): SelectOption[]{
    return views.map(view => {
      return {
        key: view.Key,
        value: view.Name
      }
    })
  }
  async getViewsArrayFromHostObject(): Promise<View[]>{
    if(!this.hostObject.view){
      const defaultView = await this.viewsService.getDefaultView(this.hostObject.resource)
      return defaultView ? [defaultView] : []
    }
    else{
      return await this.viewsService.getItems(this.hostObject.view)
    }
  }

  isValidHostObject(): boolean{
    return true
  }
  
  onDonePressed($event){
    this.hostEvents.emit({
      action: 'on-save',
      data: {
        selectedObjectKeys: $event
      }
    })
  }
  onCancelPressed(){
    this.hostEvents.emit({
      action: 'on-cancel',
      data: {}
    })
  }


}
