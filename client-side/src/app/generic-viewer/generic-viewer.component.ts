import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Injector, Input, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { GenericResourceService } from '../services/generic-resource-service';
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu";
import { DataView, GridDataView, MenuDataViewField } from '@pepperi-addons/papi-sdk';
import { DataSource } from '../data-source/data-source'
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { Editor, IGenericViewer, SelectOption, View } from '../../../../shared/entities';
import { DataViewService } from '../services/data-view-service';
import { PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { ViewsService } from '../services/views.service';
import { FieldEditorComponent } from '../field-editor/field-editor.component';
import { EXPORT, IGenericViewerConfigurationObject, IMPORT } from '../metadata';
import { GenericListComponent } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditorsService } from '../services/editors.service';
import { DIMXHostObject, PepDIMXHelperService } from '@pepperi-addons/ngx-composite-lib';

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
         private genericResourceService: GenericResourceService,
         private dataViewService: DataViewService,
         private dialogService : PepDialogService,
         private viewService: ViewsService,
         private injector: Injector,
         private editorsService: EditorsService,
         private viewContainerRef: ViewContainerRef,
         private dimxService: PepDIMXHelperService ) 
    {
          this.actions.get = this.getActionsCallBack()
          this.dialogRef = this.injector.get(MatDialogRef, null)
          this.dialogData = this.injector.get(MAT_DIALOG_DATA, null)
    }

    ngOnInit(): void {
      this.loadConfigurationObject()
      this.init()
    }

    loadConfigurationObject(){
      if(!this.configurationObject){
        this.configurationObject = {
          resource: this.dialogData?.configurationObj.resource ,
          viewsList: this.dialogData?.configurationObj.viewsList,
          selectionList: this.dialogData?.configurationObj.selectionList
        }
        this.genericViewer = this.dialogData?.genericViewer
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
        await this.configureSelectionList()
      }else{
        await this.configureGenericViewerList()
      }
      this.DisplayViewInList(this.genericViewer.view.Key)
    }

    async configureSelectionList(){
      if(!this.configurationObject.selectionList.none){
        this.isButtonConfigured = true
        this.buttonTitle = this.translate.instant("Done")
      }
    }

    async getEditor(editorKey: string): Promise<Editor | undefined>{
      const editors = await this.editorsService.getItems(editorKey)
      if(editors.length > 0){
        return editors[0]
      }
      return undefined
    }

    async configureGenericViewerList(){
      await this.initMenuItems()
      await this.initLineMenuItems()
    }

    setConfigurationObjectVariable():void{
      this.dropDownOfViews =  this.configurationObject?.viewsList || []
      this.resource = this.configurationObject?.resource || undefined
    }

    async initLineMenuItems(){
      const lineMenuDataView = this.genericViewer.lineMenuItems
      this.lineMenuItemsMap = new Map()
      lineMenuDataView?.Fields?.forEach(dataViewField => {
        this.lineMenuItemsMap.set(dataViewField.FieldID, dataViewField)
      })
    }

    async initMenuItems(){
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
          this.isButtonConfigured = true
          this.buttonTitle = field.Title
        }
      })
    }
    async getEditorDataView(editorKey: string | undefined): Promise<DataView | undefined>{
      const editorDataviews = await this.dataViewService.getDataViews(`GV_${editorKey}_Editor`)
      if(editorDataviews.length > 0){
        return editorDataviews[0]
      }
      return undefined
    }
    async getMenuDataview(viewKey: string | undefined){
      if(viewKey == undefined){
        return
      }
      return (await this.dataViewService.getDataViews(`GV_${viewKey}_Menu`))[0]
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
      if(type == "Resource"){
        return `${item[fieldID].length.toString()}  selected`
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
    }
    async onViewChange($event){
      this.genericViewer = await this.genericResourceService.getGenericView($event)
      this.loadViewBlock()
    }
  
    async loadList(dataView: GridDataView){
      const fields = dataView.Fields || []
      const columns = dataView.Columns || []
      const items = await this.genericResourceService.getItems(this.resource)
      const resourceFields = (await this.genericResourceService.getResource(this.resource))?.Fields || {}
      //in order to support arrays and references we should check the "real" type of each field, and reformat the corresponding item
      this.reformatItems(items, resourceFields)
      this.dataSource = new DataSource(items, fields,columns)
    }
    async initRecycleBin(){
      const deletedItems = await this.genericResourceService.getItems(this.resource, true)
      this.menuItems.push({
        key: "BackToList",
        text: "Back to list"
      })
      this.menuItems = this.menuItems.filter(menuItem => menuItem.key != "RecycleBin")
      this.dataSource = new DataSource(deletedItems, this.dataSource.getFields(), this.dataSource.getColumns())
      this.actions.get = this.getRecycleBinActions()
    }
    getRecycleBinActions(){
      return async(data: PepSelectionData) => {
        const actions = []
        if(data && data.rows.length == 1){
          actions.push({
            title: this.translate.instant('Restore'),
            handler: async (selectedRows) => {
              const item = this.dataSource.getItems().find(item => item.Key == selectedRows.rows[0])
              item.Hidden = false
              await this.genericResourceService.postItem(this.resource,item)
              const items = await this.genericResourceService.getItems(this.resource, true)
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
      const items = await this.genericResourceService.getItems(this.resource)
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
        DIMXExportFormat: 'json',
        DIMXExportIncludeDeleted: false,
        DIMXExportFileName: this.genericViewer.view.Name,
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
                    const items = this.dataSource.getItems()
                    const item = items.find(item => item.Key == selectedItemKey)
                    //needs to send editor
                    const dialogData = {
                      item : item,
                      editorDataView: this.genericViewer.editorDataView,
                      editor: this.genericViewer.editor
                    }
                    const config = this.dialogService.getDialogConfig({
  
                    }, 'large')
                    this.dialogService.openDialog(FieldEditorComponent, dialogData, config).afterClosed().subscribe((async isUpdatePreformed => {
                      if(isUpdatePreformed){
                        this.items = await this.genericResourceService.getItems(this.resource)
                        this.dataSource = new DataSource(this.items, this.dataSource.getFields(), this.dataSource.getColumns())
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
                  const items = this.dataSource.getItems()
                  const item = items.find(item => item.Key == selectedItemKey)
                  if(item){
                    item.Hidden = true
                    await this.genericResourceService.postItem(this.resource,item)
                    this.items = await this.genericResourceService.getItems(this.resource)
                    this.dataSource = new DataSource(this.items, this.dataSource.getFields(),this.dataSource.getColumns())
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
        editor: this.genericViewer.editor
      }
      const config = this.dialogService.getDialogConfig({
      }, 'large')
      this.dialogService.openDialog(FieldEditorComponent, dialogData, config).afterClosed().subscribe((async isUpdatePreformed => {
        if(isUpdatePreformed){
          this.items = await this.genericResourceService.getItems(this.resource)
          this.dataSource = new DataSource(this.items, this.dataSource.getFields(), this.dataSource.getColumns())
        }}))
    }

    onButtonClicked(){
      if(this.configurationObject.selectionList){
        this.onDoneButtonClicked()
      }
      else{
        this.onNewButtonClicked()
      }
    }
    onDoneButtonClicked(){
      this.pressedDoneEvent.emit(this.genericList?.getSelectedItems()?.rows || [])
      this.dialogRef?.close(this.genericList?.getSelectedItems()?.rows || [])
    }
    onCancelClicked(){
      this.pressedCancelEvent.emit()
      this.dialogRef?.close()
    }
}
