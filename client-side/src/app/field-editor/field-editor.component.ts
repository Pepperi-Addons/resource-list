import { Component, Injector, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { AddonDataScheme, FormDataView } from '@pepperi-addons/papi-sdk';
import { BehaviorSubject } from 'rxjs';
import { DROP_DOWN, Editor, IGenericViewer, IReferenceField, SELECTION_LIST, SelectOption, View } from 'shared';
import { CastingMap } from '../casting-map';
import { IGenericViewerDataSource, RegularGVDataSource } from '../generic-viewer-data-source';

import { SelectionListComponent } from '../generic-viewer/selection-list/selection-list.component';
import { GenericResourceOfflineService } from '../services/generic-resource-offline.service';
import { UtilitiesService } from '../services/utilities-service';
import { ViewsService } from '../services/views.service';

@Component({
  selector: 'app-field-editor',
  templateUrl: './field-editor.component.html',
  styleUrls: ['./field-editor.component.scss']
})
export class FieldEditorComponent implements OnInit {
  @Input() dataView: any
  @Input() editor: Editor
  
  dataSource = {}
  dialogRef = null
  dialogData
  loadCompleted: boolean = false
  resourceFields: AddonDataScheme['Fields'] //should be input in the future
  resourcesMap
  dataViewArrayFields: any[] = []
  originalValue: any = {}
  gvDataSource: IGenericViewerDataSource
  ngOnInitOrNgOnChangesHappen: boolean = false

  constructor(private injector: Injector,
     private genericResourceService: GenericResourceOfflineService,
     private utilitiesService: UtilitiesService,
     private viewsService: ViewsService,
     private dialogService: PepDialogService
     ) {
    this.dialogRef = this.injector.get(MatDialogRef, null)
    this.dialogData = this.injector.get(MAT_DIALOG_DATA, null)
   }

  ngOnInit(): void {
    if(!this.ngOnInitOrNgOnChangesHappen){
      this.loadCompleted = false
      this.ngOnInitOrNgOnChangesHappen = true
      this.init()
    }
  }

  async loadEditorVariablesAsDialog(){
    //deep copy data source in order to not change it on the list.
    this.dataView = JSON.parse(JSON.stringify(this.dialogData.editorDataView || {}))
    this.editor = this.dialogData.editor
    this.gvDataSource = this.dialogData.gvDataSource
    this.dataSource = this.dialogData.item
    this.originalValue = JSON.parse(JSON.stringify(this.dataSource))
  }

  ngOnChanges(){
    if(!this.ngOnInitOrNgOnChangesHappen){
      this.loadCompleted = false
      this.ngOnInitOrNgOnChangesHappen = true
      this.init()
    }
  }

  async init(){
    this.resourcesMap = new Map()
    if(this.dialogData){
      await this.loadEditorVariablesAsDialog()
    }
    if(this.dataView){
      await this.reformatFields()
      this.dataView = JSON.parse(JSON.stringify(this.dataView))
    }
    this.loadCompleted = true
  }
  async reformatFields(){
    const resource  = await this.genericResourceService.getResource(this.editor.Resource.Name)
    this.resourceFields = resource.Fields || {}
    await this.reformatArrayFields()
    const referenceFieldsWithoutContainedArray = this.editor.ReferenceFields?.filter(referenceField => 
      this.resourceFields[referenceField.FieldID]?.Type !=  'Array')
    if(referenceFieldsWithoutContainedArray?.length > 0){

      await this.reformatReferenceFields(referenceFieldsWithoutContainedArray)
    }
  }
  async reformatArrayFields(){
    const arrayFieldsMap: Map<string,any> = this.createArrayFieldsMap(this.resourceFields)
    this.fixDataSourceArrayFields(arrayFieldsMap)
    this.dataViewArrayFields = this.createDataViewArrayFieldsFromMap(arrayFieldsMap, this.dataView.Fields)
    this.removeArrayFieldsFromDataView(arrayFieldsMap)
    
  }
  fixDataSourceArrayFields(arrayFieldsMap: Map<string,any>){
    for(let key of arrayFieldsMap.keys()){
      /**
       * if the editor opened in a new mode, then datasource[key] is undefined 
       * but in case of array we want to see a list, and be able to add items to the list.
       * so the initial value of a field that is of type array should be [] and not undefined!
       */
      this.dataSource[key] = this.dataSource[key] || []
    }
  }
  fixDataSourceArrayField(field: any, castingMap: CastingMap, data: string | undefined, key: string){
    const type = field.Items.Type
    const arr = data?.split(',')?.map(val => castingMap.cast(type, val)) || []
    this.dataSource[key] = arr
  }
  
  createDataViewArrayFieldsFromMap(map: Map<any,any>, dataViewFields: any[]): any[]{
    return dataViewFields.reduce((prev, curr) => {
      const field = map.get(curr.FieldID)
      if(field){
        const eventsSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
        prev.push({
          Type: field.Items.Type,
          FieldID: curr.FieldID,
          Title: curr.Title,
          Array : this.dataSource[curr.FieldID],
          Event: eventsSubject
        })
      }
      return prev
    }, [])
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
  createArrayFieldsMap(resourceFields: AddonDataScheme['Fields']){
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
    if(!dataViewField){
      return
    }
    if(field?.SelectionType == SELECTION_LIST){
      dataViewField.Type = "Button"
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
      resourceItems = await this.genericResourceService.getItems(field.Resource, false, ['Key', field.DisplayField])
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
  castStringArray<T>(arr: string[], type: string): T[]{
    const castingMap = new CastingMap()
    return arr.map(val => castingMap.cast(type, val))
  } 
  castPrimitiveArraysInDataSource(){
    const castingMap = new CastingMap()
    Object.keys(this.dataSource).forEach(key => {
      if(this.resourceFields[key]?.Type && this.resourceFields[key].Type != "Array"){
        this.dataSource[key] = castingMap.cast(this.resourceFields[key].Type, this.dataSource[key])
      }
      //cast only arrays that not contained resource
      else if(this.resourceFields[key]?.Type == 'Array' && this.resourceFields[key].Items.Type != 'ContainedResource'){
        this.dataSource[key] = this.castStringArray(this.dataSource[key], this.resourceFields[key].Items.Type)
      }
    })  
  }

  async onUpdateButtonClick(){
    try{
      this.dataViewArrayFields.map(field => {
      if(field.Type == 'ContainedResource'){
          const result = {}
          field.Event.next(result)
          this.dataSource[field.FieldID] = result['value']
        }
      })
      this.castPrimitiveArraysInDataSource()
      await this.gvDataSource.update(this.dataSource)
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

  showReferenceDialog(resourceName: string, viewsDropDown: SelectOption[], currentFieldConfiguration: IReferenceField, genericViewer: IGenericViewer, gvDataSource: IGenericViewerDataSource){
    const configuration = {
      configurationObj: {
        resource: resourceName,
        viewsList: viewsDropDown,
        selectionList: {
          none: false,
          selection: 'single'
        },
      },
      genericViewer: genericViewer,
      gvDataSource: gvDataSource
    }
    const config = this.dialogService.getDialogConfig({}, 'full-screen')
    const dialogRef = this.dialogService.openDialog(SelectionListComponent, configuration, config)
    dialogRef.componentInstance.pressedCancelEvent.subscribe(() => dialogRef.close() )
    dialogRef.componentInstance.pressedDoneEvent.subscribe((data) => {
      if(data && data.length > 0){
        this.dataSource[currentFieldConfiguration.FieldID] = data[0]
        dialogRef.close()
      }
    })
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
    const gvDataSource = new RegularGVDataSource(genericViewer, this.genericResourceService)
    this.showReferenceDialog(refFieldConfiguration.Resource, viewsDropDown, refFieldConfiguration ,genericViewer, gvDataSource) 
  }
  async onReferenceClicked($event){
    const currentRefFieldConfiguration = this.getReferenceFieldConfiguration($event.ApiName)
    if(!currentRefFieldConfiguration?.Resource){
      return 
    }
    await this.openSelectionListOfRefField(currentRefFieldConfiguration)
  }
}
