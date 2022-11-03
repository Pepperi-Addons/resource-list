import { Component, Injector, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { BaseFormDataViewField, FormDataView, SchemeField } from '@pepperi-addons/papi-sdk';
import { debug } from 'console';
import { map } from 'rxjs';
import { DROP_DOWN, Editor, IGenericViewer, IReferenceField, SELECTION_LIST, SelectOption, View } from '../../../../shared/entities';
import { CastingMap } from '../casting-map';
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
  @Input() dataView: any
  dataSource = {}
  @Input() editor: Editor
  dialogRef = null
  dialogData
  loadCompleted: boolean = false
  resourceFields //should be input in the future
  resourcesMap
  dataViewArrayFields: any[] = []
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
    if($event?.editor && $event?.editor.previousValue != $event?.editor.currentValue){
      this.init()
      
    }
  }
  loadEditorVariablesAsDialog(){
    //deep copy data source in order to not change it on the list.
    this.dataSource = JSON.parse(JSON.stringify(this.dialogData.item))
    this.dataView = JSON.parse(JSON.stringify(this.dialogData.editorDataView))
    this.editor = this.dialogData.editor
  }
  async init(){
    this.loadCompleted = false
    this.resourcesMap = new Map()
    if(this.dialogData){
      this.loadEditorVariablesAsDialog()
    }
    if(this.dataView){
      await this.reformatFields()
      this.dataView = JSON.parse(JSON.stringify(this.dataView))
    }
    this.loadCompleted = true
  }
  async reformatFields(){
    await this.reformatArrayFields()
    if(this.editor?.ReferenceFields){
      await this.reformatReferenceFields(this.editor.ReferenceFields)
    }
  }
  async reformatArrayFields(){
    const arrayFieldsMap: Map<string,any> = await this.createArrayFieldsMap()
    this.fixDataSourceArrayFields(arrayFieldsMap)
    this.dataViewArrayFields = this.createDataViewArrayFieldsFromMap(arrayFieldsMap, this.dataView.Fields)
    // const dataSource = this.dataSource
    // this.dataViewArrayFields  = this.dataView.Fields.filter(dataViewField => arrayFieldsMap.has(dataViewField.FieldID))
    this.removeArrayFieldsFromDataView(arrayFieldsMap)
    
  }
  fixDataSourceArrayFields(arrayFieldsMap: Map<string,any>){
    const castingMap = new CastingMap()
    for(let key of arrayFieldsMap.keys()){
      if(this.dataSource[key]){
        this.fixDataSourceArrayField(arrayFieldsMap.get(key), castingMap, this.dataSource[key], key)
      }
    }
    // dataViewArrayFields.map(dataViewField => {
    //   if(this.dataSource[dataViewField.FieldID]){
    //     this.fixDataSourceArrayField(dataViewField, castingMap, this.dataSource[dataViewField.FieldID]) 
    //   }
    // })
  }
  fixDataSourceArrayField(field: any, castingMap: CastingMap, data: string, key: string){
    const type = field.Items.Type
    const arr = data.split(',')?.map(val => castingMap.cast(type, val)) || []
    this.dataSource[key] = arr
  }

  //array field events:
  onAddItemToArrayEvent(data: any){

  }
  onEditItemInArrayEvent(data: any){
  }
  onDeleteItemInArrayEvent(data: any){

  }


  createDataViewArrayFieldsFromMap(map: Map<any,any>, dataViewFields: any[]): any[]{
    return dataViewFields.reduce((prev, curr) => {
      const field = map.get(curr.FieldID)
      if(field){
        prev.push({
          Type: field.Items.Type,
          FieldID: curr.FieldID,
          Title: curr.Title,
          Array : this.dataSource[curr.FieldID]
        })
      }
      return prev
    }, [])
    // for(const [key, value] of map){
    //   arr.push({
    //     FieldID: key,
    //     ...value
    //   })
    // }
    // return arr
  }
  removeArrayFieldsFromDataView(arrayFieldsMap){
    this.fixLayoutOfDataView(arrayFieldsMap)
    this.dataView.Fields = this.dataView.Fields.filter(dataViewField => !arrayFieldsMap.has(dataViewField.FieldID))
  }
  fixLayoutOfDataView(arrayFieldsMap){
    let counter = 0;
    this.dataView.Fields.forEach(field => {
      if(!arrayFieldsMap.has(field.FieldID)){
        field.Layout.Origin.Y = counter
        counter++
      }
    })
  }
  async createArrayFieldsMap(){
    const resource = await this.genericResourceService.getResource(this.editor.Resource.Name)
    const resourceFields = resource.Fields
    const map = new Map<string,any>()
    Object.keys(resourceFields).map(fieldID => {
      if(resourceFields[fieldID].Type == 'Array'){
        map.set(fieldID, resourceFields[fieldID])
      }
    })
    return map
  }
  async reformatReferenceFields(referenceFields: IReferenceField[] = []){
    await Promise.all(referenceFields.map(async referenceField => await this.fixReferenceField(referenceField)))
  }
  async fixReferenceField(field: IReferenceField){
    const dataViewField = this.dataView.Fields?.find(dataViewField => dataViewField.FieldID == field.FieldID)
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
    console.log(`${dataViewField}`);
    console.log(`${dataViewField}`);
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
  // async getResourceNameToOpen(resourceName: string, field: string): Promise<string>{
  //   const currentResource = await this.genericResourceService.getResource(resourceName)
  //   const fieldIDOfResourceToOpen = Object.keys(currentResource.Fields).find(fieldID => fieldID == field)
  //   if(!fieldIDOfResourceToOpen){
  //     this.utilitiesService.showDialog('Error', 'ReferenceFieldDoesNotExistMSG', 'close')
  //     return undefined
  //   }
  //  return currentResource.Fields[fieldIDOfResourceToOpen].Resource
  // }

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
