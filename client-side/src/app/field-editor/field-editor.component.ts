import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenericFormComponent } from '@pepperi-addons/ngx-composite-lib/generic-form';
import { KeyValuePair } from '@pepperi-addons/ngx-lib';
import { PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { AddonData, AddonDataScheme, BaseFormDataViewField, Collection, CollectionField, DataView, DataViewField, FormDataView } from '@pepperi-addons/papi-sdk';
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
  @Input() dataView: FormDataView
  @Input() editor: Editor

  @ViewChild(GenericFormComponent) itemForm: GenericFormComponent
  
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
  selectionFieldsCache: {
    [key: string]: string
  } = {};

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
      this.dataView = JSON.parse(JSON.stringify(this.dataView));
    }
    setTimeout(() => {this.loadCompleted = true},0);
    console.log('data view', this.dataView)
    console.log('data source', this.dataSource)
  }
  async reformatFields(){
    const resource  = await this.genericResourceService.getResource(this.editor.Resource.Name)
    this.resourceFields = resource.Fields || {}
    if (Object.keys(this.dataSource || {}).length > 0) {
      this.handleDocumentKeyFields(resource as Collection);
    }
    this.handleOptionalValues(resource.Fields as Collection['Fields']);
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
          Event: eventsSubject,
          OptionalValues: field.OptionalValues || field.Items.OptionalValues
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
      const field: CollectionField = resourceFields[fieldID] as CollectionField
      const optionalValues = field.OptionalValues || field.Items?.OptionalValues || [];
      if(field.Type == 'Array' && optionalValues.length === 0){
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
      if(field.DisplayField) {
        if (this.dataSource[field.FieldID]) {
          await this.handleSelectionListDisplayField(field);
        }
        else {
          this.dataSource[field.FieldID] = 'Select Value'
        }
      }
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
    let resourceItems: AddonData[] = this.resourcesMap.get(field.Resource)
    if(!resourceItems){
      resourceItems = (await this.genericResourceService.getItems(field.Resource, false, ['Key', field.DisplayField])).Objects
      this.resourcesMap.set(field.Resource, resourceItems )
    }
    dataViewField['OptionalValues'] = resourceItems.map((item):KeyValuePair<string> => {
      return {
        Key: item['Key'],
        Value: item[field.DisplayField]
      }
    }).sort((first,second) => {
      return first.Value.localeCompare(second.Value);
    })
  }
  castStringArray<T>(arr: string[], type: string): T[]{
    const castingMap = new CastingMap()
    return arr.map(val => castingMap.cast(type, val))
  } 
  castPrimitiveArraysInDataSource(){
    const castingMap = new CastingMap()
    Object.keys(this.dataSource).forEach(key => {
      const field: CollectionField = this.resourceFields[key] as CollectionField
      if(field?.Type && field.Type != "Array"){
        this.dataSource[key] = castingMap.cast(this.resourceFields[key].Type, this.dataSource[key])
      }
      //cast only arrays that not contained resource
      else if(field?.Type == 'Array' && field.Items.Type != 'ContainedResource'){
        const optionalValues = field.OptionalValues || field.Items?.OptionalValues || [];
        let fieldValue = this.dataSource[key];
        if (optionalValues.length > 0) {
          //in case of no match, split returns an array with an empty string inside of it, so we will filter the array.
          fieldValue = fieldValue.split(';').filter(val => val);
        }
        this.dataSource[key] = this.castStringArray(fieldValue, this.resourceFields[key].Items.Type)
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
      this.replaceDisplayFieldWithKey();
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
        this.handleSelectionListDisplayField(currentFieldConfiguration).then(() => {
          this.itemForm.updateFields([{
            FieldId: currentFieldConfiguration.FieldID,
            Params: {
              Value: this.dataSource[currentFieldConfiguration.FieldID]
            }
          }])
          dialogRef.close()
        });
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
  async handleSelectionListDisplayField(field: IReferenceField){
    const itemKey = this.dataSource[field.FieldID];
    try {
      const item = await this.genericResourceService.getItemByKey(field.Resource, itemKey);
      if(item && item[field.DisplayField]) {
        const value = item[field.DisplayField];
        this.replaceKeyWithDisplayField(field.FieldID, value);
      }
    }
    catch (err) {
      console.log('could not handle diaply field. got exception', err);
    }
  }

  // we are saving the selected key inside a cache object so we can replace back before sending to server
  private replaceKeyWithDisplayField(fieldID: string, value: string) {
    this.selectionFieldsCache[fieldID] = this.dataSource[fieldID];
    this.dataSource[fieldID] = value;
  }

  // before saving the form, we need to replace the selection list values with the item key we saved in cache
  private replaceDisplayFieldWithKey() {
    Object.keys(this.selectionFieldsCache || {}).forEach(field => {
      this.dataSource[field] = this.selectionFieldsCache[field];
    });
  }

  private handleDocumentKeyFields(resource: Collection) {
    if(resource.DocumentKey && resource.DocumentKey.Type === 'Composite') {
      resource.DocumentKey.Fields?.forEach(fieldName => {
        this.changeDVFieldValue(fieldName, (dvField => {
          dvField.ReadOnly = true;
          return dvField;
        }))
      });
    }
  }

  private handleOptionalValues(resourceFields: Collection['Fields']) {
    Object.keys(resourceFields || {}).forEach(fieldName => {
      const optionalValues = resourceFields[fieldName].OptionalValues;
      if(optionalValues && optionalValues.length > 0) {
        // if the field is Array, and have optional values, we need to convert to ';' delimited string
        if(resourceFields[fieldName].Type === 'Array') {
          this.dataSource[fieldName] = (this.dataSource[fieldName] || []).join(';');
        }
        this.changeDVFieldValue(fieldName, (dvField => {
          dvField.Type = resourceFields[fieldName].Type != 'Array' ? 'ComboBox' : 'MultiTickBox';
          dvField['OptionalValues'] = optionalValues.map(item => {
            return {
              Key: item,
              Value: item
            }
          })
          return dvField
        }))
      }
    })
  }

  private changeDVFieldValue(fieldName: string, cb: (dvField: BaseFormDataViewField) => BaseFormDataViewField) {
    const index = this.dataView.Fields?.findIndex(x=> x.FieldID === fieldName)
    if (index > -1 && cb) {
      const dvField = cb(this.dataView.Fields[index]);
      this.dataView.Fields.splice(index, 1, dvField);
    }
  }
}