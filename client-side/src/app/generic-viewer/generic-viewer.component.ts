import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Injector, Input, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu";
import { GridDataView, MenuDataViewField } from '@pepperi-addons/papi-sdk';
import { DataSource } from '../data-source/data-source'
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { Editor, IGenericViewer, SelectOption, View } from '../../../../shared/entities';
import { PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { FieldEditorComponent } from '../field-editor/field-editor.component';
import { EXPORT, IGenericViewerConfigurationObject, IMPORT } from '../metadata';
import { GenericListComponent } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DIMXHostObject, PepDIMXHelperService } from '@pepperi-addons/ngx-composite-lib';
import { IGenericViewerDataSource, isRegularGVDataSource, RegularGVDataSource } from '../generic-viewer-data-source';
import { GVButton, ListOptions } from './generic-viewer.model';
import { GenericResourceOfflineService } from '../services/generic-resource-offline.service';

@Component({
    selector: 'app-generic-viewer',
    templateUrl: './generic-viewer.component.html',
    styleUrls: ['./generic-viewer.component.scss']
})
export class GenericViewerComponent implements OnInit {
    @ViewChild(GenericListComponent) genericList;

    @Input() configurationObject: IGenericViewerConfigurationObject
    @Output() pressedDoneEvent: EventEmitter<number> = new EventEmitter<number>()
    @Output() pressedCancelEvent: EventEmitter<void> = new EventEmitter<void>()
    @Input() genericViewer: IGenericViewer
    @Input() genericViewerDataSource: IGenericViewerDataSource

    listOptions: ListOptions

    dataSource: DataSource
    menuItems: PepMenuItem[] = []
    items: any[] = []
    actions: any = {}
    dropDownOfViews: SelectOption[] = []
    resource: string
    lineMenuItemsMap: Map<string, MenuDataViewField>
    buttonTitle: string
    isButtonConfigured: boolean = false
    dialogRef = null
    dialogData = null

    constructor(private translate: TranslateService,
         private genericResourceService: GenericResourceOfflineService,
         private dialogService : PepDialogService,
         private injector: Injector,
         private viewContainerRef: ViewContainerRef,
         private dimxService: PepDIMXHelperService ) 
    {
          this.actions.get = this.getActionsCallBack()
          this.dialogRef = this.injector.get(MatDialogRef, null)
          this.dialogData = this.injector.get(MAT_DIALOG_DATA, null)
    }
    createButtonArray(): GVButton[]{
      const result: GVButton[] = []
      if(this.isButtonConfigured){
        result.push({
          key: "new", 
          value: this.buttonTitle, 
          styleType: "strong", 
          classNames: "save"
        })
      }
      return result

    }
    createListOptions(){
      const actions =  this.actions
      const selectionType = this.configurationObject.selectionList?.selection || "single"
      const menuItems = this.menuItems || []
      const dropDownOfViews = this.dropDownOfViews || []
      const buttons: GVButton[] = this.createButtonArray()
      return {
          actions,
          selectionType,
          menuItems, 
          dropDownOfViews, 
          buttons,
      }
    }
    ngOnInit(): void {
      this.loadConfigurationObject()
      this.init()
    }

    loadConfigurationObject(){
      if(!this.configurationObject){
        this.configurationObject = {
          viewsList: this.dialogData?.configurationObj.viewsList,
          selectionList: this.dialogData?.configurationObj.selectionList
        }
        this.genericViewer = this.dialogData?.genericViewer,
        this.genericViewerDataSource = this.dialogData?.gvDataSource
      }
    }
    
    async init(){
      this.setConfigurationObjectVariable()
      await this.loadViewBlock()
    }

    initDimxService(){
      if(this.genericViewer.view){
        const dimxHostObject: DIMXHostObject = {
          DIMXAddonUUID: this.genericViewer.view.Resource.AddonUUID,
          DIMXResource: this.genericViewer.view.Resource.Name
        }
        this.dimxService.register(this.viewContainerRef, dimxHostObject, (onDIMXProcessDoneEvent: any) => {
          this.onDIMXProcessDone(onDIMXProcessDoneEvent);
        })
      }
    }

    async onDIMXProcessDone(event){
      await this.loadViewBlock()
    }

    async loadViewBlock(){
      this.initDimxService()
      if(this.configurationObject.selectionList){
        this.configureSelectionList()
      }else{
        this.configureGenericViewerList()
      }
      this.DisplayViewInList(this.genericViewer.view.Key)
    }

    configureSelectionList(){
      if(!this.configurationObject.selectionList.none){
        this.isButtonConfigured = true
        this.buttonTitle = this.translate.instant("Done")
      }
    }

    configureGenericViewerList(){
      this.initMenuItems()
      this.initLineMenuItems()
    }

    setConfigurationObjectVariable():void{
      this.dropDownOfViews =  this.configurationObject?.viewsList || []
      this.resource = this.genericViewer?.view?.Resource?.Name
    }

    initLineMenuItems(){
      const lineMenuDataView = this.genericViewer.lineMenuItems
      this.lineMenuItemsMap = new Map()
      lineMenuDataView?.Fields?.forEach(dataViewField => {
        this.lineMenuItemsMap.set(dataViewField.FieldID, dataViewField)
      })
    }

    initMenuItems(){
      const menuDataView = this.genericViewer.menuItems
      this.menuItems = []
      menuDataView?.Fields?.forEach(field => {
        if(field.FieldID != "New"){
          this.menuItems.push({
            key: field.FieldID,
            text: field.Title
          })
        }
        else{
          this.isButtonConfigured = this.genericViewer.editor != undefined
          this.buttonTitle = field.Title
        }
      })
    }
    reformatItems(items, resourceFields){
      return items.map(item => {
        return this.reformatItem(item, resourceFields)
      })
    }
    reformatItem(item, resourceFields){
      Object.keys(item).forEach(fieldID => {
        item[fieldID] = resourceFields[fieldID] != undefined? this.getFixedField(item, fieldID, resourceFields): item[fieldID]
      })
    }
    getFixedField(item, fieldID, resourceFields){
      if(resourceFields[fieldID].Type == "Array"){
        return this.getFixedArrayField(item, fieldID, resourceFields[fieldID].Items.Type)
      }
      return item[fieldID]
    }
    getFixedArrayField(item, fieldID, type){
      if(type == "Resource" || type == "ContainedResource"){
        return `${item[fieldID].length.toString()} items selected`
      }
      return item[fieldID].join(',')
    }
    async DisplayViewInList(viewKey){
      if(this.genericViewer.viewDataview){
        this.loadList(this.genericViewer.viewDataview)
      }
      //if there is no dataview we will display an empty list
      else{
        this.dataSource = new DataSource([],[],[])
      }
      this.listOptions = this.createListOptions()
    }
    async onViewChanged($event){
      this.genericViewer = await this.genericResourceService.getGenericView($event)
      if(isRegularGVDataSource(this.genericViewerDataSource)){
        this.genericViewerDataSource.setGenericViewer(this.genericViewer)
      }
      //set generic view
      this.loadViewBlock()
    }
    async getItemsCopy(){
      this.items = await this.genericViewerDataSource.getItems()
      return JSON.parse(JSON.stringify(this.items))
    }
    async loadList(dataView: GridDataView){
      const fields = dataView.Fields || []
      const columns = dataView.Columns || []
      const items = await this.getItemsCopy()
      const resourceFields = await this.genericViewerDataSource.getFields()
      //in order to support arrays and references we should check the "real" type of each field, and reformat the corresponding item
      this.reformatItems(items, resourceFields)
      this.dataSource = new DataSource(items, fields,columns)
    }
    async initRecycleBin(){
      const deletedItems = await (this.genericViewerDataSource as RegularGVDataSource).getDeletedItems()
      this.menuItems = [({
        key: "BackToList",
        text: "Back to list"
      })]
      this.menuItems = this.menuItems.filter(menuItem => menuItem.key != "RecycleBin")
      this.dataSource = new DataSource(deletedItems, this.dataSource.getFields(), this.dataSource.getColumns())
      this.actions.get = this.getRecycleBinActions()
      this.listOptions = this.createListOptions()
    }
    getRecycleBinActions(){
      return async(data: PepSelectionData) => {
        const actions = []
        if(data && data.rows.length == 1){
          actions.push({
            title: this.translate.instant('Restore'),
            handler: async (selectedRows) => {
              const item = (await this.genericViewerDataSource.getDeletedItems()).find(item => item.Key == selectedRows.rows[0])
              const items = await this.genericViewerDataSource.restore(item)
              this.dataSource = new DataSource(items, this.dataSource.getFields(), this.dataSource.getColumns())
              
            }
          })
        }
        return actions
      }
    }
    ngOnChanges(changes: SimpleChanges): void {
      if(!(changes.configurationObject?.isFirstChange() && changes.genericViewer?.isFirstChange())){
        this.init()
      }
    }
    async backToList(){
      const items = await this.getItemsCopy()
      this.menuItems = this.menuItems.filter(menuItem => menuItem.key != "BackToList")
      this.menuItems.push({
        key: "RecycleBin",
        text: "Recycle bin"
      })
      this.actions.get = this.getActionsCallBack()
      this.dataSource = new DataSource(items, this.dataSource.getFields(), this.dataSource.getColumns())
    }
    menuItemClick($event){
      switch($event.source.key){
        case 'RecycleBin':
          this.initRecycleBin()
          break;
        case 'BackToList': 
          this.backToList()
          break
        case EXPORT:
          this.export()
          break
        case IMPORT:
          this.import()
          break
      }
    }
    import(){
      this.dimxService?.import({
        OverwriteObject: false,
        OwnerID: this.genericViewer.view.Resource.AddonUUID
      })
      
    }
    export(){
      this.dimxService?.export({
        DIMXExportFormat: 'csv',
        DIMXExportIncludeDeleted: false,
        DIMXExportFileName: this.genericViewer.view.Name,
        DIMXExportDelimiter: ',',
        DIMXExportFields: (this.genericViewer.viewDataview.Fields?.map(field => field.FieldID) || []).join()
      })
    }
     getActionsCallBack(){
      return async (data: PepSelectionData) => {
          const actions = []
          if(data && data.rows.length == 1 && this.lineMenuItemsMap != undefined){
            if(this.genericViewer.editor && this.genericViewer.editorDataView && this.lineMenuItemsMap.has("Edit")){
              actions.push({
                  title: this.lineMenuItemsMap.get("Edit").Title,
                  handler : async (selectedRows) => {
                    const selectedItemKey = selectedRows.rows[0]
                    const dialogData = {
                      item : await this.genericViewerDataSource.getEditorItemByKey(selectedItemKey) || {},
                      editorDataView: this.genericViewer.editorDataView,
                      editor: this.genericViewer.editor,
                      originalValue: this.items.find(item => item.Key == selectedItemKey),
                      gvDataSource: this.genericViewerDataSource
                    }
                    const config = this.dialogService.getDialogConfig({
  
                    }, 'large') 
                    this.dialogService.openDialog(FieldEditorComponent, dialogData, config).afterClosed().subscribe((async isUpdatePreformed => {
                      if(isUpdatePreformed){
                        await this.loadList(this.genericViewer.viewDataview)
                      }
                     }))
                  }
              })
            }
            if(this.lineMenuItemsMap.has("Delete")){
              actions.push({
                title: this.lineMenuItemsMap.get("Delete").Title,
                handler: async (selectedRows) => {
                  const selectedItemKey = selectedRows.rows[0]
                  const items = await this.genericViewerDataSource.getItems()
                  const item = items.find(item => item.Key == selectedItemKey)
                  if(item){
                    await this.genericViewerDataSource.deleteItem(item)
                    await this.loadList(this.genericViewer.viewDataview)
                  }
                }
              })
            }
          }
          return actions
      }
    }
    onNewButtonClicked(){
      const dialogData = {
        item : {},
        editorDataView: this.genericViewer.editorDataView,
        editor: this.genericViewer.editor,
        gvDataSource: this.genericViewerDataSource
      }
      const config = this.dialogService.getDialogConfig({
      }, 'large')
      this.dialogService.openDialog(FieldEditorComponent, dialogData, config).afterClosed().subscribe((async isUpdatePreformed => {
        if(isUpdatePreformed){
          const items = await this.getItemsCopy()
          this.dataSource = new DataSource(items, this.dataSource.getFields(), this.dataSource.getColumns())
        }}))
    }

    onButtonClicked(event){
      console.log(event)
      if(this.configurationObject.selectionList){
        this.onDoneButtonClicked(event)
      }
      else{
        this.onNewButtonClicked()
      }
    }
    onDoneButtonClicked(event){
      this.pressedDoneEvent.emit(this.genericList?.getSelectedItems()?.rows || [])
      this.dialogRef?.close(this.genericList?.getSelectedItems()?.rows || [])
    }
    onCancelClicked(){
      this.pressedCancelEvent.emit()
      this.dialogRef?.close()
    }
}
