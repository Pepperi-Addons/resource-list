import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GenericResourceService } from '../services/generic-resource-service';
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu";
import { config } from '../addon.config'
import { ViewsCard } from '../draggable-card-fields/cards.model';
import { DataView, GridDataView, MenuDataViewField } from '@pepperi-addons/papi-sdk';
import { DataSource } from '../data-source/data-source'
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { SelectOption, View } from '../../../../shared/entities';
import { DataViewService } from '../services/data-view-service';
import { PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { ViewsService } from '../services/views.service';
import { FieldEditorComponent } from '../field-editor/field-editor.component';
import { IGenericViewerConfigurationObject } from '../metadata';

@Component({
    selector: 'app-generic-viewer',
    templateUrl: './generic-viewer.component.html',
    styleUrls: ['./generic-viewer.component.scss']
})
export class GenericViewerComponent implements OnInit {
    @Input() configurationObject: IGenericViewerConfigurationObject
    dataSource: DataSource
    menuItems: PepMenuItem[] = []
    viewsList: ViewsCard[] = []
    items: any[] = []
    actions: any = {}
    //new page block
    dropDownOfViews: SelectOption[] = []
    currentViewKey : string
    resource: string
    editorDataView: DataView
    currentView: View
    lineMenuItemsMap: Map<string, MenuDataViewField>
    addButtonTitle: string
    isAddButtonConfigured: boolean = false

    constructor(private translate: TranslateService,
         private genericResourceService: GenericResourceService,
         private dataViewService: DataViewService,
         private dialogService : PepDialogService,
         private viewService: ViewsService) 
    {
          this.actions.get = this.getActionsCallBack()
    }
    ngOnInit(): void {
      console.log(`ng onInit!!!!!!!`);
      this.init()
    }
    async init(){
      this.setConfigurationObjectVariable()
      if(this.configurationObject?.viewsList?.length == 0 || this.configurationObject?.resource == undefined){
        this.dataSource = new DataSource([],[],[])
      }
      else{
        await this.loadGenericViewerComponent()
      }
    }

    async loadGenericViewerComponent(){
      this.createDropDownOfViews()
      await this.setCurrentViewAndKey()
      this.editorDataView = await this.getEditorDataView(this.currentView?.Editor)
      await this.initMenuItems(this.currentViewKey)
      await this.initLineMenuItems(this.currentViewKey)
      this.DisplayViewInList(this.currentViewKey)
    }
    setConfigurationObjectVariable():void{
      this.viewsList = this.configurationObject?.viewsList || []
      this.resource = this.configurationObject?.resource || undefined
    }
    async setCurrentViewAndKey(){
      this.currentViewKey = this.dropDownOfViews?.length > 0? this.dropDownOfViews[0].key : undefined
      this.currentView = (await this.viewService.getItems(this.currentViewKey))[0]
    }
    async initLineMenuItems(viewKey: string){
      const lineMenuDataView = await this.getLineMenuDataView(viewKey)
      this.lineMenuItemsMap = new Map()
      lineMenuDataView.Fields?.forEach(dataViewField => {
        this.lineMenuItemsMap.set(dataViewField.FieldID, dataViewField)
      })
    }
    async getLineMenuDataView(viewKey: string){
      if(viewKey == undefined){
        return 
      }
      return (await this.dataViewService.getDataViews(`RV_${viewKey}_LineMenu`))[0]
    }
    async initMenuItems(viewKey: string){
      const menuDataView = await this.getMenuDataview(viewKey)
      this.menuItems = []
      menuDataView?.Fields?.forEach(field => {
        if(field.FieldID != "Add"){
          this.menuItems.push({
            key: field.FieldID,
            text: field.Title
          })
        }
        else{
          this.isAddButtonConfigured = true
          this.addButtonTitle = field.Title
        }
      })
    }
    async getEditorDataView(editorKey: string | undefined): Promise<DataView | undefined>{
      if(editorKey == undefined){
        return 
      }
      return (await this.dataViewService.getDataViews(`GV_${editorKey}_Editor`))[0]
    }
    async getMenuDataview(viewKey: string | undefined){
      if(viewKey == undefined){
        return
      }
      return (await this.dataViewService.getDataViews(`GV_${viewKey}_Menu`))[0]
    }
    async DisplayViewInList(viewKey){
      const dataViews = await this.dataViewService.getDataViewsByProfile(`GV_${viewKey}_View`, "Rep");
      if(dataViews.length > 0){
        this.loadList(dataViews[0] as GridDataView)
        console.log(`display list ${dataViews} `);
      }
      //if there is no dataview we will display an empty list
      else{
        this.dataSource = new DataSource([],[],[])
      }
    }
    async onViewChange($event){
      this.currentViewKey = $event
      this.currentView = (await this.viewService.getItems(this.currentViewKey))[0]
      this.DisplayViewInList(this.currentViewKey)
    }
  
    async loadList(dataView: GridDataView){
      const fields = dataView.Fields || []
      const columns = dataView.Columns || []
      const items = await this.genericResourceService.getItems(this.resource)
      this.dataSource = new DataSource(items, fields,columns)
    }

    createDropDownOfViews(){
      this.dropDownOfViews = this.viewsList.map(card => {
        return {
          key: card.selectedView.key,
          value: card.selectedView.value
        }
      })
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
    ngOnChanges(e: any): void {
      console.log(`generic viewer - ng onChanges!!`);
      this.init()
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
      }
    }
     getActionsCallBack(){
      return async (data: PepSelectionData) => {
          const actions = []
          if(data && data.rows.length == 1 && this.lineMenuItemsMap != undefined){
            if(this.editorDataView && this.lineMenuItemsMap.has("Edit")){
              actions.push({
                  title: this.lineMenuItemsMap.get("Edit").Title,
                  handler : async (selectedRows) => {
                    const selectedItemKey = selectedRows.rows[0]
                    const items = this.dataSource.getItems()
                    const item = items.find(item => item.Key == selectedItemKey)
                    const dialogData = {
                      item : item,
                      editorDataView: this.editorDataView,
                      resourceName: this.resource
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
        editorDataView: this.editorDataView,
        resourceName: this.resource
      }
      const config = this.dialogService.getDialogConfig({
      }, 'large')
      this.dialogService.openDialog(FieldEditorComponent, dialogData, config).afterClosed().subscribe((async isUpdatePreformed => {
        if(isUpdatePreformed){
          this.items = await this.genericResourceService.getItems(this.resource)
          this.dataSource = new DataSource(this.items, this.dataSource.getFields(), this.dataSource.getColumns())
        }}))
    }
}
