import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GenericResourceService } from '../services/generic-resource-service';
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu";
import { config } from '../addon.config'
import { ViewsCard } from '../draggable-card-fields/cards.model';
import { DataView, GridDataView, GridDataViewColumn, MenuDataViewField } from '@pepperi-addons/papi-sdk';
import { DataSource } from '../data-source/data-source'
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { SelectOption, View } from '../../../../shared/entities';
import { DataViewService } from '../services/data-view-service';
import { PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { ViewsService } from '../services/views.service';
import { FieldEditorComponent } from '../field-editor/field-editor.component';

@Component({
    selector: 'block',
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
    @Input() hostObject: any;
    datasource: DataSource
    title: string
    menuItems: PepMenuItem[] = []
    allowExport: boolean = false;
    allowImport: boolean = false;
    menuDisabled: boolean = false;
    widthArray: GridDataViewColumn[] = []
    viewsList: ViewsCard[] = []
    fields: any[] = []
    items: any[] = []
    actions: any = {}
    minHeight: number
    relativeHeight: number
    allowEdit:boolean = false;


    //new page block
    dropDownOfViews: SelectOption[] = []
    currentViewKey : string
    resource: string
    editorDataView: DataView
    currentView: View
    lineMenuItemsMap: Map<string, MenuDataViewField>
    addButtonTitle: string
    isAddButtonConfigured: boolean = false
    inRecycleBinMode: boolean = false

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService,
         private genericResourceService: GenericResourceService,
         private dataViewService: DataViewService,
         private dialogService : PepDialogService,
         private viewService: ViewsService) {
          this.genericResourceService.pluginUUID = config.AddonUUID
          this.actions.get = this.getActionsCallBack()
    }
    ngOnInit(): void {
      this.loadBlock()
    }

    async loadBlock(){
      this.viewsList = this.hostObject?.configuration?.viewsList || []
      this.resource = this.hostObject.configuration?.resource || "" 
      this.createDropDownOfViews()
      this.currentViewKey = this.dropDownOfViews?.length > 0? this.dropDownOfViews[0].key : ""
      this.currentView = (await this.viewService.getItems(this.currentViewKey))[0]
      this.editorDataView =this.currentView?.Editor? await this.getEditorDataView(this.currentView.Editor) : undefined
      await this.initMenuItems(this.currentViewKey)
      await this.initLineMenuItems(this.currentViewKey)
      this.DisplayViewInList(this.currentViewKey)
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
      }
      //if there is no dataview we will display an empty list
      else{
        this.datasource = new DataSource([],[],[])
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
      this.datasource = new DataSource(items, fields,columns)
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
      this.datasource = new DataSource(deletedItems, this.datasource.getFields(), this.datasource.getColumns())
      this.actions.get = this.getRecycleBinActions()
    }
    getRecycleBinActions(){
      return async(data: PepSelectionData) => {
        const actions = []
        if(data && data.rows.length == 1){
          actions.push({
            title: this.translate.instant('Restore'),
            handler: async (selectedRows) => {
              const item = this.datasource.getItems().find(item => item.Key == selectedRows.rows[0])
              item.Hidden = false
              await this.genericResourceService.postItem(this.resource,item)
              const items = await this.genericResourceService.getItems(this.resource, true)
              this.datasource = new DataSource(items, this.datasource.getFields(), this.datasource.getColumns())
            }
          })
        }
        return actions
      }
    }
    ngOnChanges(e: any): void {
      this.loadBlock()
    }
    async backToList(){
      const items = await this.genericResourceService.getItems(this.resource)
      this.menuItems = this.menuItems.filter(menuItem => menuItem.key != "BackToList")
      this.menuItems.push({
        key: "RecycleBin",
        text: "Recycle bin"
      })
      this.actions.get = this.getActionsCallBack()
      this.datasource = new DataSource(items, this.datasource.getFields(), this.datasource.getColumns())
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

//-------------------------------------------------------------------------------
//---------------------------Old Page Block Functions ---------------------------
//-------------------------------------------------------------------------------

//     init(){
//       this.loadVariablesFromHostObject()
//       this.menuDisabled = !(this.allowImport || this.allowExport)
//       this.menuItems = this.getMenuItems()
//       // this.fields = this.generateFieldsFromCards()
//       this.widthArray = this.generateWidthArrayFromCardsList()
//       this.loadGenericList()
//     }
//     loadVariablesFromHostObject(){
//       this.title = this.hostObject?.configuration?.title || this.title
//       this.allowExport = Boolean(this.hostObject?.configuration?.allowExport)
//       this.allowImport = Boolean(this?.hostObject?.configuration?.allowImport)
//       this.viewsList = this.hostObject?.configuration?.cardsList
//       this.minHeight = this.hostObject?.configuration?.minHeight || 20;
//       this.relativeHeight = this.hostObject?.configuration?.relativeHeight || 100
//       this.allowEdit = this.hostObject?.configuration?.allowEdit
//       this.updateResourceNameAndItemsIfChanged()
//     }
//     updateResourceNameAndItemsIfChanged(){
//       if(this.hostObject?.configuration?.resourceName != this.resourceName){
//         this.resourceName = this.hostObject?.configuration?.resourceName || this.resourceName
//         this.udcService.getItems(this.resourceName).then(items => {
//           this.items = items
//           this.datasource = new DataSource(items, this.fields, this.widthArray)
//         })
//       }
//     }
//     generateWidthArrayFromCardsList(): GridDataViewColumn[]{
//       if(!this.viewsList || this.viewsList.length == 0){
//         return []
//       }
//       return this.viewsList.map(card => {
//         return {'Width': 0}})
//     }
//     // generateFieldsFromCards(){
//     //   if(!this.cardsList){
//     //     return []
//     //   }
//     //   const returnVal = this.cardsList.map(card => card.value);
//     //   return returnVal
//     // }
//     onMenuItemClick($event){ 
//       switch ($event.source.key){
//         case 'Export':
//           // this.dimx?.DIMXExportRun({
//           //   DIMXExportFormat: "csv",
//           //   DIMXExportIncludeDeleted: false,
//           //   DIMXExportFileName: this.resourceName,
//           //   DIMXExportFields: this.fields.map((field) => field.FieldID).join(),
//           //   DIMXExportDelimiter: ","
//           // });
//           break;
//         case 'Import':
//           // this.dimx?.uploadFile({
//           //   OverwriteOBject: true,
//           //   Delimiter: ",",
//           //   OwnerID: UDC_UUID
//           // });
//           break;    
//       // }
//     }
//     } 
//     // onDIMXProcessDone($event){
//     //     this.udcService.getItems(this.resourceName).then(items => {
//     //       this.datasource = new DataSource(this.translate, items, this.fields)
//     //     })
//     // }
//     getMenuItems() {
//       return[
//           {
//             key:'Export',
//             text: this.translate.instant('Export'),
//             hidden: !this.allowExport
//           },
//           {
//             key: 'Import',
//             text: this.translate.instant('Import'),
//             hidden: !this.allowImport
//           }]
//     }
     getActionsCallBack(){
      return async (data: PepSelectionData) => {
          const actions = []
          if(data && data.rows.length == 1 && this.lineMenuItemsMap != undefined){
            if(this.editorDataView && this.lineMenuItemsMap.has("Edit")){
              actions.push({
                  title: this.lineMenuItemsMap.get("Edit").Title,
                  handler : async (selectedRows) => {
                    const selectedItemKey = selectedRows.rows[0]
                    const items = this.datasource.getItems()
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
                        this.datasource = new DataSource(this.items, this.datasource.getFields(), this.datasource.getColumns())
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
                  const items = this.datasource.getItems()
                  const item = items.find(item => item.Key == selectedItemKey)
                  if(item){
                    item.Hidden = true
                    await this.genericResourceService.postItem(this.resource,item)
                    this.items = await this.genericResourceService.getItems(this.resource)
                    this.datasource = new DataSource(this.items, this.datasource.getFields(),this.datasource.getColumns())
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
          this.datasource = new DataSource(this.items, this.datasource.getFields(), this.datasource.getColumns())
        }}))
    }
    // onAddClick(){
    //   const formData = {
    //     service : this.service
    //   }
    //   const config = this.dialogService.getDialogConfig({
  
    //   }, 'large');
    //   config.data = new PepDialogData({
    //       content: AddFormComponent
    //   })
    //   this.dialogService.openDialog(AddFormComponent, formData, config).afterClosed().subscribe((value => {
    //     this.loadGenericList(false)
    //   }))
    // }
//     sendObjectToEditor(key: string, value: string){
//       this.hostEvents.emit({
//         action: 'set-parameter',
//         key: key,
//         value: value 
//       })
//     }
//     onAddClick(){
//       if(this.hostObject?.configuration?.allowEdit){
//         if(this.hostObject.configuration.currentOpenMode == 'replace'){
//             this.router.navigate([this.hostObject.configuration.currentSlug])
//         }
//         else{
//           this.sendObjectToEditor("","")
//         }
//       }
//    }
// }
  }
