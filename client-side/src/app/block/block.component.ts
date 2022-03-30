import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IPepGenericListActions, IPepGenericListDataSource, IPepGenericListInitData, IPepGenericListTableInputs, PepGenericListService } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { IPepListSortingChangeEvent } from '@pepperi-addons/ngx-lib/list';
import { BlockService } from './block.service' 
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu";
import { DIMXComponent } from '@pepperi-addons/ngx-composite-lib/dimx-export';
import { UDCUUID } from '../addon.config';

@Component({
    selector: 'block',
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
    @ViewChild('dimx') dimx:DIMXComponent | undefined;
    @Input() hostObject: any;
    datasource: DataSource = new DataSource(this.translate, [])
    actions: IPepGenericListActions
    resource: any
    title: string
    udcUUID: string = UDCUUID
    menuItems: PepMenuItem[] = []
    allowExport: boolean = false;
    allowImport: boolean = false;
    menuDisabled: boolean = false;
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService,
        private genericListService: PepGenericListService, private blockService: BlockService) {
    }
    ngOnInit(): void {
      this.allowExport = Boolean(this.hostObject.configuration.allowExport)
      this.allowImport = Boolean(this.hostObject.configuration.allowImport)
      this.menuDisabled = !(this.allowImport || this.allowExport)
      this.title = this.hostObject.configuration.title || ""
      this.resource = this.hostObject.configuration.resource
      this.menuItems = this.getMenuItems()
    }
    ngOnChanges(e: any): void {
      if(this.hostObject.configuration){
        this.title = this.hostObject.configuration.title || this.title
        this.resource = this.hostObject.configuration.resource || this.resource
        this.allowExport = Boolean(this.hostObject.configuration.allowExport)
        this.allowImport = Boolean(this.hostObject.configuration.allowImport)
        debugger
        this.menuDisabled = !(this.allowImport || this.allowExport)
        this.menuItems = this.getMenuItems()
        this.blockService.pluginUUID = "0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3"
        this.blockService.getItems(this.resource).then(items => {
          this.datasource = new DataSource(this.translate, items)
        })
      }
    }
    onMenuItemClick($event){

      switch ($event.source.key){
        case 'Export':
          this.dimx?.DIMXExportRun({
            DIMXExportFormat: "csv",
            DIMXExportIncludeDeleted: false,
            DIMXExportFileName: this.resource,
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
        this.blockService.getItems(this.resource).then(items => {
          this.datasource = new DataSource(this.translate, items)
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
    constructor(private translate: TranslateService, items: any[]){
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
              Fields: [
                {
                  FieldID: 'Key',
                  Type: 'TextBox',
                  Title: this.translate.instant('Key'),
                  Mandatory: false,
                  ReadOnly: true
                },
                {
                  FieldID: 'CreationDateTime',
                  Type: 'TextBox',
                  Title: this.translate.instant('CreationDateTime'),
                  Mandatory: false,
                  ReadOnly: true
                },
                {
                FieldID: 'ModificationDateTime',
                Type: 'TextBox',
                Title: this.translate.instant('ModificationDateTime'),
                Mandatory: false,
                ReadOnly: true
              }
              ],
              Columns: [
                {
                  Width: 33
                },
                {
                  Width: 33
                },
                {
                  Width: 33
                }
              ],
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
