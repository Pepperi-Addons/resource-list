import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IPepGenericListDataSource, IPepGenericListInitData, IPepGenericListTableInputs, PepGenericListService } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { IPepListSortingChangeEvent } from '@pepperi-addons/ngx-lib/list';
import { UDCService } from '../services/udc-service';
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu";
import { DIMXComponent } from '@pepperi-addons/ngx-composite-lib/dimx-export';
import { UDCUUID } from '../addon.config';
import { config } from '../addon.config'
import { BlockEditorCard } from '../draggable-card-fields/cards.model';
import { GridDataViewColumn } from '@pepperi-addons/papi-sdk';

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
    udcUUID: string = UDCUUID
    menuItems: PepMenuItem[] = []
    allowExport: boolean = false;
    allowImport: boolean = false;
    menuDisabled: boolean = false;
    widthArray: GridDataViewColumn[] = []
    cardsList: BlockEditorCard[] = []
    fields: any[] = []
    items: any[] = []
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService,
        private genericListService: PepGenericListService, private udcService: UDCService) {
          this.udcService.pluginUUID = config.AddonUUID
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
        this.datasource = new DataSource(this.translate, this.items, this.fields, this.widthArray)
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
      this.updateResourceNameAndItemsIfChanged()
    }
    updateResourceNameAndItemsIfChanged(){
      if(this.hostObject?.configuration?.resourceName != this.resourceName){
        this.resourceName = this.hostObject?.configuration?.resourceName || this.resourceName
        this.udcService.getItems(this.resourceName).then(items => {
          this.items = items
          this.datasource = new DataSource(this.translate, items, this.fields, this.widthArray)
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
          this.dimx?.DIMXExportRun({
            DIMXExportFormat: "csv",
            DIMXExportIncludeDeleted: false,
            DIMXExportFileName: this.resourceName,
            DIMXExportFields: ['Key','CreationDateTime', 'ModificationDateTime'].join(),
            DIMXExportDelimiter: ","
          });
          break;
        case 'Import':
          this.dimx?.uploadFile({
            OverwriteOBject: true,
            Delimiter: ",",
            OwnerID: UDCUUID
          });
          break;    
      }
    }
    onDIMXProcessDone($event){
        this.udcService.getItems(this.resourceName).then(items => {
          this.datasource = new DataSource(this.translate, items, this.fields)
        })
    }
    getMenuItems() {
      return this.menuDisabled? [] :  [
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
}
class DataSource implements IPepGenericListDataSource{
    items: any[] = []
    constructor(private translate: TranslateService, items: any[], private fields: any[], private widthArray: GridDataViewColumn[] = []){
      this.items = items
    }
    async init(params: { searchString?: string; filter?: any; sorting?: IPepListSortingChangeEvent; fromIndex: number; toIndex: number; }): Promise<IPepGenericListInitData> {
        return {
            dataView: {
              Context: {
                Name: '',
                Profile: { InternalID: 0 },
                ScreenSize: 'Landscape'
              },
              Type: 'Grid',
              Title: 'Block',
              Fields: this.fields,
              Columns: this.widthArray,
              FrozenColumnsCount: 0,
              MinimumColumnWidth: 0
            },
            totalCount: this.items.length,
            items: this.items
          }; 
    }
    async inputs?(): Promise<IPepGenericListTableInputs> {
        return {
            pager: {
                type: 'scroll'
            },
            selectionType: 'multi'
        }
      }
}
