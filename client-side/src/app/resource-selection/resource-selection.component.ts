import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectOption, View } from '../../../../shared/entities';
import { IGenericViewerConfigurationObject, ResultObject } from '../metadata';
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
    const resultObject = await this.createGenericViewerConfiguration()
    if(resultObject.error){
      //display error msg
      this.utilitiesService.showDialog('Error', resultObject.error, 'close')
      return
    }
    this.configurationObj = resultObject.data
    this.loadCompleted = true
  }
  async  createGenericViewerConfiguration(): Promise<ResultObject<IGenericViewerConfigurationObject>>{
    const resource = this.hostObject.resource
    const resultOfView = await this.getView(resource, this.hostObject.view)
    if(resultOfView.error){
      resultOfView
    }
    const view = resultOfView.data
    const resultObject = this.validateHostObject(this.hostObject, view)
    if(resultObject.error){
      return resultObject
    }
    const viewsDropDown = [{
      key: view.Key,
      value: view.Name
    }]
    debugger
    return {
      data: {
        resource: resource,
        viewsList: viewsDropDown,
        selectionList: {
          none: this.hostObject.allowNone,
          selection: this.hostObject.selectionMode
        }
      }
    }
  }
  validateHostObject(hostObject, view: View): ResultObject<undefined>{
    const resultObject = {
      data: undefined,
      error: undefined
    }
    if(!hostObject.resource){
      resultObject.error = 'NoResourceError'
      return resultObject
    }
    if(view.Resource.Name != this.hostObject.resource){
      resultObject.error = 'ViewNotOfThatResourceError'
      return resultObject
    }
    if(hostObject.selectionMode != 'single' && hostObject.selectionMode != 'multi'){
      resultObject.error = 'IllegalSelectionModeError'
      return resultObject
    }
    try{
      if(hostObject.selectedObjectKeys && hostObject.selectedObjectKeys.length > 0 && hostObject.selectionMode == 'single'){
        resultObject.error = 'SelectedKeysSingleSelectionError'
        return resultObject
      }
    }catch(err){
      resultObject.error = 'SelectedKeysMustBeArrayOrUndefinedError'
      return resultObject
    }
    return {
      data: undefined,
    }

    
    //resource is mandatory 
    //if has view he needs to be of that resource 
    //allowNone must be boolean
    //selectionMode must be single or multi 
    //selected object keys must be an array of strings
    //if selection mode is single and selected object keys has length greater than 1 then throw error
  }
  async getGenericViewerConfigurationObject(): Promise<IGenericViewerConfigurationObject | undefined>{
    const resource = this.hostObject.resource
    const view = await this.getView(resource, this.hostObject.view)
    if(!view){
      this.utilitiesService.showDialog('Error', 'NoViewError', 'close')
      return undefined
    }

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
  async getView(resource: string, viewKey: string): Promise<ResultObject<View>>{
      if(viewKey){
        try{
          const view = (await this.viewsService.getItems(viewKey))[0]
          return {
            data: view
          }
        }catch(err){
          return {
            error: "NoSuchViewError"
          }
        }
      }
      try{
        const view =  await this.viewsService.getDefaultView(resource)
        return {
          data: view
        }
      }catch(err){
        return {
          error: "ResourceDoesNotExistOrHaveNoViewsError"
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
    //resource is mandatory 
    //if has view he needs to be of that resource 
    //allowNone must be boolean
    //selectionMode must be single or multi 
    //selected object keys must be an array of strings
    //if selection mode is single and selected object keys has length greater than 1 then throw error
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
