import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UDCService } from '../services/udc-service';
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu";
// import { DIMXComponent } from '@pepperi-addons/ngx-composite-lib/dimx-export';
import { UDC_UUID } from '../addon.config';
import { config } from '../addon.config'
import { ViewsCard } from '../draggable-card-fields/cards.model';
import { GridDataView, GridDataViewColumn } from '@pepperi-addons/papi-sdk';
import { DataSource } from '../data-source/data-source'
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { Params, Router } from '@angular/router';
import { SelectOption } from '../../../../shared/entities';
import { DataViewService } from '../services/data-view-service';

@Component({
    selector: 'block',
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
    // @ViewChild('dimx') dimx:DIMXComponent | undefined;
    @Input() hostObject: any;
    datasource: DataSource
    resourceName: string
    title: string
    udcUUID: string = UDC_UUID
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

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService,
         private udcService: UDCService,
         private router: Router,
         private dataViewService: DataViewService) {
          this.udcService.pluginUUID = config.AddonUUID
          // this.actions.get = this.getActionsCallBack()
    }
    ngOnInit(): void {
      this.loadBlock()
    }

    loadBlock(){
      this.viewsList = this.hostObject?.configuration?.viewsList || []
      this.resource = this.hostObject.configuration?.resource || ""
      this.createDropDownOfViews()
      this.currentViewKey = this.dropDownOfViews?.length > 0? this.dropDownOfViews[0].key : ""
      this.DisplayViewInList(this.currentViewKey)
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
    onViewChange($event){
      this.currentViewKey = $event
      this.DisplayViewInList(this.currentViewKey)

    }
    async loadList(dataView: GridDataView){
      const fields = dataView.Fields || []
      const columns = dataView.Columns || []
      const items = await this.udcService.getItems(this.resource)
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

    ngOnChanges(e: any): void {
      this.loadBlock()
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
//      getActionsCallBack(){
//       return async (data: PepSelectionData) => {
//           const actions = []
//           if(data && data.rows.length == 1){
//             actions.push({
//                 title: this.translate.instant('Delete'),
//                 handler: async (selectedRows) => {
//                   await this.udcService.postItem(this.resourceName, {Key: selectedRows.rows[0], Hidden: true})
//                   this.loadGenericList()
//                 }
              
//             })
//             if (this.hostObject?.configuration?.allowEdit) {
//                   actions.push({
//                       title: this.translate.instant('Edit'),
//                       handler : async (selectedRows) => {
//                         const key = `collection_${this.resourceName}`
//                         const value = selectedRows.rows[0]
//                         if(this.hostObject.configuration.currentOpenMode == 'replace'){
//                           this.router.navigate([this.hostObject.configuration.currentSlug],
//                             {
//                               queryParams: {
//                                 [key]: `\"${value}\"`
//                               }
//                             })
//                         }
//                         else{
//                           this.sendObjectToEditor(key,value)
//                         }
//                       }
//                   })
//             }
//           }
//           return actions
//       }
//     }
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
