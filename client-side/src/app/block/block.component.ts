import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UDCService } from '../services/udc-service';
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu";
import { DIMXComponent } from '@pepperi-addons/ngx-composite-lib/dimx-export';
import { UDC_UUID } from '../addon.config';
import { config } from '../addon.config'
import { BlockEditorCard } from '../draggable-card-fields/cards.model';
import { GridDataViewColumn } from '@pepperi-addons/papi-sdk';
import { DataSource } from '../data-source/data-source'
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { Params, Router } from '@angular/router';

@Component({
    selector: 'block',
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
    @ViewChild('dimx') dimx:DIMXComponent | undefined;
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
    cardsList: BlockEditorCard[] = []
    fields: any[] = []
    items: any[] = []
    actions: any = {}
    minHeight: number
    relativeHeight: number
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService,
         private udcService: UDCService,
         private router: Router) {
          this.udcService.pluginUUID = config.AddonUUID
          this.actions.get = this.getActionsCallBack()
    }
    ngOnInit(): void {
      this.init()
    }
    ngOnChanges(e: any): void {
      if(this.hostObject?.configuration){
        this.init()
      }
    }
    loadGenericList(){
      if(this.widthArray.length > 0 && this.items){
        this.datasource = new DataSource(this.items, this.fields, this.widthArray)
    }
    }
    init(){
      this.loadVariablesFromHostObject()
      this.menuDisabled = !(this.allowImport || this.allowExport)
      this.menuItems = this.getMenuItems()
      this.fields = this.generateFieldsFromCards()
      this.widthArray = this.generateWidthArrayFromCardsList()
      this.loadGenericList()
    }
    loadVariablesFromHostObject(){
      this.title = this.hostObject?.configuration?.title || this.title
      this.allowExport = Boolean(this.hostObject?.configuration?.allowExport)
      this.allowImport = Boolean(this?.hostObject?.configuration?.allowImport)
      this.cardsList = this.hostObject?.configuration?.cardsList
      this.minHeight = this.hostObject?.configuration?.minHeight || 20;
      this.relativeHeight = this.hostObject?.configuration?.relativeHeight || 100
      this.updateResourceNameAndItemsIfChanged()
    }
    updateResourceNameAndItemsIfChanged(){
      if(this.hostObject?.configuration?.resourceName != this.resourceName){
        this.resourceName = this.hostObject?.configuration?.resourceName || this.resourceName
        this.udcService.getItems(this.resourceName).then(items => {
          this.items = items
          this.datasource = new DataSource(items, this.fields, this.widthArray)
        })
      }
    }
    generateWidthArrayFromCardsList(): GridDataViewColumn[]{
      if(!this.cardsList || this.cardsList.length == 0){
        return []
      }
      return this.cardsList.map(card => {
        return {'Width': card.width}})
    }
    generateFieldsFromCards(){
      if(!this.cardsList){
        return []
      }
      const returnVal = this.cardsList.map(card => card.value);
      return returnVal
    }
    onMenuItemClick($event){ 
      switch ($event.source.key){
        case 'Export':
          // this.dimx?.DIMXExportRun({
          //   DIMXExportFormat: "csv",
          //   DIMXExportIncludeDeleted: false,
          //   DIMXExportFileName: this.resourceName,
          //   DIMXExportFields: this.fields.map((field) => field.FieldID).join(),
          //   DIMXExportDelimiter: ","
          // });
          break;
        case 'Import':
          // this.dimx?.uploadFile({
          //   OverwriteOBject: true,
          //   Delimiter: ",",
          //   OwnerID: UDC_UUID
          // });
          break;    
      // }
    }
    } 
    // onDIMXProcessDone($event){
    //     this.udcService.getItems(this.resourceName).then(items => {
    //       this.datasource = new DataSource(this.translate, items, this.fields)
    //     })
    // }
    getMenuItems() {
      return[
          {
            key:'Export',
            text: this.translate.instant('Export'),
            hidden: !this.allowExport
          },
          {
            key: 'Import',
            text: this.translate.instant('Import'),
            hidden: !this.allowImport
          }]
    }
     getActionsCallBack(){
      return async (data: PepSelectionData) => {
          const actions = []
          if (data && data.rows.length == 1 && this.hostObject?.configuration?.allowEdit) {
                actions.push({
                    title: this.translate.instant('Navigate'),
                    handler : async (selectedRows) => {
                      const key = `collection_${this.resourceName}`
                      const value = selectedRows.rows[0]
                      if(this.hostObject.configuration.currentOpenMode == 'replace'){
                        this.router.navigate([this.hostObject.configuration.currentSlug],
                          {
                            queryParams: {
                              [key]: `\"${value}\"`
                            }
                          })
                      }
                      else{
                        this.hostEvents.emit({
                          action: 'set-parameter',
                          key: key,
                          value: value 
                      })
                      }
                    }
                })
          }
          return actions
      }
    }
    onAddClick(){
      if(this.hostObject?.configuration?.allowEdit){
        if(this.hostObject.configuration.currentOpenMode == 'replace'){
            this.router.navigate([this.hostObject.configuration.currentSlug])
          }
      }
   }
}
