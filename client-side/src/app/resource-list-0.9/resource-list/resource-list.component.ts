import { Component, OnInit } from '@angular/core';
import { ClientEventsService } from '../services/client-events.service';
import { IPepGenericListDataSource } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { GVButton, SmartSearchInput } from '../metadata';
import { PepMenuItem } from '@pepperi-addons/ngx-lib/menu';
import { StateManager } from '../helpers/state-manager';
import { PepperiList } from '../helpers/pepperi-list';
import { List, ListContainer, Sorting, ViewsMenu } from 'shared';
import { IPepSelectionOption } from '@pepperi-addons/ngx-lib/select-panel';
import { IPepListSortingChangeEvent, PepListSelectionType } from '@pepperi-addons/ngx-lib/list';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss']
})
export class ResourceListComponent implements OnInit {
  pepperiList: PepperiList
  smartSearch: SmartSearchInput
  menu: PepMenuItem[]
  buttons: GVButton[]
  lineMenu: any
  dataSource: IPepGenericListDataSource
  loadCompleted: boolean = false
  search: boolean
  title: string
  selectionType: PepListSelectionType
  viewsMenu: ViewsMenu
  selectedViewKey: string

  //subjects for state
  pageIndex: ReplaySubject<number> = new ReplaySubject()
  searchString: ReplaySubject<string> = new ReplaySubject()
  sorting: ReplaySubject<IPepListSortingChangeEvent> = new ReplaySubject()
  list1: List = {
    Key: "LIST_KEY",
    Name: "FirstList",
    Resource: "Friends",
    Views: [
        {
            Key: "7debbfa8-a085-11ed-a8fc-0242ac120002",
            Type: "Grid",
            Title: "FirstView",
            Blocks: [
                {
                    Title: "My name",
                    Configuration: {
                        Type: "TextBox",
                        FieldID: "name",
                        Width: 10
                    },
                    DrawURL: 'addon-cpi/drawGrid',
                    AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3'
                },
                {
                    Title: "My age",
                    Configuration: {
                        Type: "NumberInteger",
                        FieldID: "age",
                        Width: 10
                    },
                    DrawURL: 'addon-cpi/drawGrid',
                    AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3'
                },
            ],
        }
    ],
    Menu: {
        Blocks: [
            {
                Key: 'recycleBin',
                Title: 'Recycle Bin',
                DrawURL: 'addon-cpi/drawMenuBlock',
                AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
                ExecuteURL: 'addon-cpi/menuExecution'
            },
            {
                Key: 'import',
                Title: 'Import',
                DrawURL: 'addon-cpi/drawMenuBlock',
                AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
                ExecuteURL: 'addon-cpi/menuExecution'
            },
            {
                Key: 'export',
                Title: 'Export',
                DrawURL: 'addon-cpi/drawMenuBlock',
                AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
                ExecuteURL: 'addon-cpi/menuExecution'
            },
            {
                Key: 'new',
                Title: 'New',
                DrawURL: 'addon-cpi/drawMenuBlock',
                AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
                ButtonStyleType: "Strong",
                ExecuteURL: 'addon-cpi/menuExecution'
            }
        ]
    },
    LineMenu: {
        Blocks: [
            {
                Key: "delete",
                Title: "Delete",
                DrawURL: 'addon-cpi/drawLineMenuBlock',
                AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
                ExecuteURL: 'addon-cpi/menuExecution'
            },
            {
                Key: "edit",
                Title: "Edit",
                DrawURL: 'addon-cpi/drawLineMenuBlock',
                AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
                ExecuteURL: 'addon-cpi/menuExecution'
            }
        ]
    },
    Search: {
        Fields: [
            {
                FieldID: "Key"
            },
            {
                FieldID: "name"
            }
        ]
    },
    SmartSearch: {
        Fields: [
            {
                FieldID: "name",
                Title: "name",
                Type: "String"
            },
            {
                FieldID: "age",
                Title: "name",
                Type: "String"
            }
        ]
    },
    SelectionType: "Single",
    Sorting: {Ascending: false, FieldID: "name"}
}

  
  constructor(private clientEventService: ClientEventsService) { }

  ngOnInit(): void {
    this.load()
  }

  async load(){
    this.pepperiList = new PepperiList(this.clientEventService, undefined, {ListKey: "LIST_KEY", SearchString: 'aa'})
    this.subscribeToChanges()
    this.loadCompleted = true
  }

  subscribeToChanges(){
    this.pepperiList.subscribeToDataSource((ds: IPepGenericListDataSource) => this.dataSource = ds)
    this.subscribeToLayoutChanges()
    this.subscribeToStateChanges()
  }

  subscribeToLayoutChanges(){
    this.pepperiList.subscribeToLayoutChanges()
    .onButtonsChanged(buttons => this.buttons = buttons)
    .onMenuChanged(menu => this.menu = menu)
    .onLineMenuChanged((lineMenu) => this.lineMenu = lineMenu)
    .onSmartSearchChanged(data => this.smartSearch = data)
    .onSearchChanged(visible => this.search = visible)
    .onTitleChanged(title => this.title = title)
    .onSelectionTypeChanged(selectionType => this.selectionType = selectionType)
    .onViewsMenuChanged(viewsMenu => {
      this.viewsMenu = viewsMenu
    })
    .onSelectedViewChanged(key => this.selectedViewKey = key)
  }

  subscribeToStateChanges(){
    this.pepperiList.subscribeToStateChanges()
    .onPageIndexChanged((index => this.pageIndex.next(index)))
    .onSearchStringChanged((str) => this.searchString.next(str))
    .onSortingChanged((sorting) => this.sorting.next(sorting))
  }

  onClientMenuClick(key: string){
    this.pepperiList.onMenuClick(key)
  }

}
