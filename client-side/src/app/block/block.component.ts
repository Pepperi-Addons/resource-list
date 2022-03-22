import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPepGenericListActions, IPepGenericListDataSource, IPepGenericListInitData, IPepGenericListPager, IPepGenericListTableInputs, PepGenericListService } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { IPepListSortingChangeEvent } from '@pepperi-addons/ngx-lib/list';
import { BlockService } from './block.service' 

@Component({
    selector: 'block',
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
    @Input() hostObject: any;
    datasource: DataSource = new DataSource(this.translate, [])
    noDataFoundMessage: string
    actions: IPepGenericListActions
    resource: any
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService,
        private genericListService: PepGenericListService, private blockService: BlockService) {
    }

    ngOnInit(): void {
    }
    ngOnChanges(e: any): void {
      if(this.hostObject.configuration){
        this.resource = this.hostObject.configuration.resource
        this.blockService.pluginUUID = "0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3"
        this.blockService.getItems(this.resource).then(items => {
          this.datasource = new DataSource(this.translate, items)
        })
        debugger
      }
    }
}

class DataSource implements IPepGenericListDataSource{
    items: any[] = []
    constructor(private translate: TranslateService, items: any[]){
      this.items = items
    }
    setItems(items:any[]){
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
