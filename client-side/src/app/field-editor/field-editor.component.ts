import { Component, Injector, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { BaseFormDataViewField, FormDataView } from '@pepperi-addons/papi-sdk';
import { Editor, IReferenceField, SelectOption, View } from '../../../../shared/entities';
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
    this.dataSource = this.dataSource || this.dialogData?.item 
    this.dataView = this.dataView || this.dialogData?.editorDataView
    this.editor = this.editor || this.dialogData?.editor
    this.fixReferenceFields(this.editor.ReferenceFields, this.dataView)
    this.loadCompleted = true
  }
  fixReferenceFields(referenceFields: IReferenceField[] = [], dataView: FormDataView){
    referenceFields.forEach(referenceField => {
      this.fixReferenceField(referenceField, dataView)
    })
  }
  fixReferenceField(field: IReferenceField, dataView: FormDataView){
    const dataViewField = dataView.Fields?.find(dataViewField => dataViewField.FieldID == field.FieldID)
    if(field?.SelectionType == "list"){
      dataViewField.Type == "Button"
    }
    else if(field?.SelectionType == 'dropDown'){
      dataViewField.Type = "ComboBox"
    }
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
  showReferenceDialog(resourceName: string, viewsDropDown: SelectOption[], currentFieldConfiguration: IReferenceField){
    const configurationObj: IGenericViewerConfigurationObject = {
      resource: resourceName,
      viewsList: viewsDropDown,
      selectionList: {
        none: false,
        selection: 'single'
      }
    }
    const config = this.dialogService.getDialogConfig({}, 'large')
    this.dialogService.openDialog(GenericViewerComponent, configurationObj, config).afterClosed().subscribe((async data => {
      if(data && data.length > 0){
        this.dataSource[currentFieldConfiguration.DisplayField] = data[0]
      }
     }))
  }
  async onReferenceClicked($event){
    const refFieldsConfiguration = this.editor.ReferenceFields || []
    const currentRefFieldConfiguration = refFieldsConfiguration.find(refField => refField.DisplayField == $event.ApiName)
    let resourceNameToOpen = currentRefFieldConfiguration?.Resource
    if(!currentRefFieldConfiguration || !resourceNameToOpen){
      return 
    }
    let selectionListKey = currentRefFieldConfiguration?.SelectionListKey
    let selectionList = currentRefFieldConfiguration?.SelectionList
    selectionList = undefined
    if(!selectionListKey || !selectionList){
      const defaultView = await this.viewsService.getDefaultView(resourceNameToOpen)
      selectionListKey = defaultView?.Key
      selectionList = defaultView?.Name
    }
    const viewsDropDown =
    [
      {
        key: selectionListKey,
        value: selectionList
      }
    ] 
    this.showReferenceDialog(resourceNameToOpen, viewsDropDown, currentRefFieldConfiguration)
  }
}
