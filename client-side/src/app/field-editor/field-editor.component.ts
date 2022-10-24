import { Component, Injector, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { BaseFormDataViewField, FormDataView, SchemeField } from '@pepperi-addons/papi-sdk';
import { DROP_DOWN, Editor, IGenericViewer, IReferenceField, SELECTION_LIST, SelectOption, View } from '../../../../shared/entities';
import { GenericViewerComponent } from '../generic-viewer/generic-viewer.component';
import { IGenericViewerConfigurationObject } from '../metadata';
import { GenericResourceService } from '../services/generic-resource-service';
import { UtilitiesService } from '../services/utilities-service';
import { ViewsService } from '../services/views.service';

@Component({
  selector: 'app-field-editor',
  templateUrl: './field-editor.component.html',
  styleUrls: ['./field-editor.component.scss']
})
export class FieldEditorComponent implements OnInit {
  @Input() dataView
  @Input() dataSource
  @Input() editor: Editor
  dialogRef = null
  dialogData
  loadCompleted: boolean = false
  resourceFields //should be input in the future
  resourcesMap
  constructor(private injector: Injector,
     private genericResourceService: GenericResourceService,
     private utilitiesService: UtilitiesService,
     private viewsService: ViewsService,
     private dialogService: PepDialogService
     ) {
    this.dialogRef = this.injector.get(MatDialogRef, null)
    this.dialogData = this.injector.get(MAT_DIALOG_DATA, null)
   }

  ngOnInit(): void {
    this.init()
  }
  ngOnChanges($event){
    this.init()
  }
  async init(){
    this.resourcesMap = new Map()
    this.dataSource = this.dataSource || this.dialogData?.item 
    this.dataView = this.dataView || this.dialogData?.editorDataView
    this.editor = this.editor || this.dialogData?.editor
    await this.fixReferenceFields(this.editor.ReferenceFields, this.dataView)
    this.loadCompleted = true
  }
  async fixReferenceFields(referenceFields: IReferenceField[] = [], dataView: any){
    await Promise.all(referenceFields.map(async referenceField => await this.fixReferenceField(referenceField, dataView)))
  }
  async fixReferenceField(field: IReferenceField, dataView: any){
    const dataViewField = dataView.Fields?.find(dataViewField => dataViewField.FieldID == field.FieldID)
    if(field?.SelectionType == SELECTION_LIST){
      dataViewField.Type == "Button"
    }
    else if(field?.SelectionType == DROP_DOWN){
      dataViewField.Type = "ComboBox"
      if(field.DisplayField){
        await this.addOptionalValuesToDataViewField(field, dataViewField)
      }
      else{
        dataViewField.ReadOnly = true
      }
    }
  }
  async addOptionalValuesToDataViewField(field: IReferenceField, dataViewField: any){
    let resourceItems = this.resourcesMap.get(field.Resource)
    if(!resourceItems){
      resourceItems = await this.genericResourceService.getItems(field.Resource)
      this.resourcesMap.set(field.Resource, resourceItems )
    }
    dataViewField['OptionalValues'] = resourceItems.map(item => {
      return {
        Key: item['Key'],
        Value: item[field.DisplayField]
      }
    })
    //get its resource
    //validate that display field is a field of that resource
    //if not open error dialog
    //if yes, return drop down of key and value of fields
  }
  async onUpdateButtonClick(){
    try{
      await this.genericResourceService.postItem(this.editor.Resource.Name, this.dataSource)
    }
    catch(err){
      console.log(err)
      this.dialogRef.close(false)
      this.utilitiesService.showDialog('Error', 'UpdateErrorMSG', 'close')
      return
    }
    this.dialogRef.close(true)
  }

  onCancelButtonClicked(){
    this.dialogRef.close(false)
  }
  async getResourceNameToOpen(resourceName: string, field: string): Promise<string>{
    const currentResource = await this.genericResourceService.getResource(resourceName)
    const fieldIDOfResourceToOpen = Object.keys(currentResource.Fields).find(fieldID => fieldID == field)
    if(!fieldIDOfResourceToOpen){
      this.utilitiesService.showDialog('Error', 'ReferenceFieldDoesNotExistMSG', 'close')
      return undefined
    }
   return currentResource.Fields[fieldIDOfResourceToOpen].Resource
  }

  async getViewsOfResource(resourceName: string): Promise<View[]>{
    const views = await this.viewsService.getItems()
   return views.filter(view => view.Resource.Name == resourceName)
  }
  getViewsDropDown(views: View[]): SelectOption[]{
   return  views.map(view => {
      return {
        key: view.Key,
        value: view.Name
      }
    })
  }
  showReferenceDialog(resourceName: string, viewsDropDown: SelectOption[], currentFieldConfiguration: IReferenceField, genericViewer: IGenericViewer){
    const configuration = {
      configurationObj: {
        resource: resourceName,
        viewsList: viewsDropDown,
        selectionList: {
          none: false,
          selection: 'single'
        },
      },
      genericViewer: genericViewer
    }
    // const configurationObj: IGenericViewerConfigurationObject = {
    //   resource: resourceName,
    //   viewsList: viewsDropDown,
    //   selectionList: {
    //     none: false,
    //     selection: 'single'
    //   },
    // }
    const config = this.dialogService.getDialogConfig({}, 'large')
    this.dialogService.openDialog(GenericViewerComponent, configuration, config).afterClosed().subscribe((async data => {      
      if(data && data.length > 0){
        this.dataSource[currentFieldConfiguration.FieldID] = data[0]
      }
     }))
  }
  getReferenceFieldConfiguration(fieldID: string){
    const refFieldsConfiguration = this.editor.ReferenceFields || []
    return refFieldsConfiguration.find(refField => refField.FieldID == fieldID)
  }
  async getSelectionListAndKey(refFieldConfiguration: IReferenceField){
    let selectionList = refFieldConfiguration.SelectionList
    let selectionListKey = refFieldConfiguration.SelectionListKey
    if(!selectionList || !selectionListKey){
      const defaultView = await this.viewsService.getDefaultView(refFieldConfiguration.Resource)
      selectionListKey = defaultView?.Key
      selectionList = defaultView?.Name
    }
    return {selectionList: selectionList, selectionListKey: selectionListKey}
  }
  async openSelectionListOfRefField(refFieldConfiguration: IReferenceField){
    const {selectionList, selectionListKey} = await this.getSelectionListAndKey(refFieldConfiguration)
    const genericViewer = await this.genericResourceService.getSelectionList(selectionListKey)
    const viewsDropDown =
    [
      {
        key: selectionListKey,
        value: selectionList
      }
    ]
    this.showReferenceDialog(refFieldConfiguration.Resource, viewsDropDown, refFieldConfiguration ,genericViewer) 
  }
  async onReferenceClicked($event){
    const currentRefFieldConfiguration = this.getReferenceFieldConfiguration($event.ApiName)
    if(!currentRefFieldConfiguration?.Resource){
      return 
    }
    await this.openSelectionListOfRefField(currentRefFieldConfiguration)
  }
}
