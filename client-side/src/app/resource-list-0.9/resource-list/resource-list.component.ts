import { Component, OnInit } from '@angular/core';
import { ClientEventsService } from '../services/client-events.service';
import { IPepGenericListActions, IPepGenericListDataSource, IPepGenericListPager, IPepGenericListParams } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { GVButton, SmartSearchInput, ViewsMenuUI } from '../metadata';
import { PepMenuItem } from '@pepperi-addons/ngx-lib/menu';
import { PepperiList } from '../helpers/pepperi-list';
import { List } from 'shared';
import { IPepListSortingChangeEvent, PepListSelectionType } from '@pepperi-addons/ngx-lib/list';
import { ReplaySubject } from 'rxjs';
import { ResourceService } from '../services/resources.service';

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
  lineMenu: IPepGenericListActions
  dataSource: IPepGenericListDataSource
  loadCompleted: boolean = false
  search: boolean
  title: string
  selectionType: PepListSelectionType
  viewsMenu: ViewsMenuUI
  selectedViewKey: string
  
  //pager subjects
  $pageIndex: ReplaySubject<number> = new ReplaySubject()
  $pageSize: ReplaySubject<number> = new ReplaySubject()
  $pageType: ReplaySubject<IPepGenericListPager['type']> = new ReplaySubject()

  $searchString: ReplaySubject<string> = new ReplaySubject()
  $sorting: ReplaySubject<IPepListSortingChangeEvent> = new ReplaySubject()


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
        },
        {
            Key: "17e76a7e-c725-11ed-afa1-0242ac120002",
            Type: "Grid",
            Title: "SecondView",
            Blocks: [
                {
                    Title: "Second name",
                    Configuration: {
                        Type: "TextBox",
                        FieldID: "name",
                        Width: 10
                    },
                    DrawURL: 'addon-cpi/drawGrid',
                    AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3'
                },
                {
                    Title: "Second age",
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
    SelectionType: "Multi",
    Sorting: {Ascending: false, FieldID: "name"}
}

  constructor(private clientEventService: ClientEventsService, private resourceService: ResourceService) { }

  ngOnInit(): void {
    this.load()
  }

  async load(){
    this.pepperiList = new PepperiList(this.clientEventService, {ListKey: "LIST_KEY", SearchString: 'aa'}, this.list1)
    this.subscribeToChanges()
    this.lineMenu = this.pepperiList.getListActions()
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
    .onSmartSearchChanged(data => this.smartSearch = data)
    .onSearchChanged(visible => this.search = visible)
    .onTitleChanged(title => this.title = title)
    .onSelectionTypeChanged(selectionType => this.selectionType = selectionType)
    // needs to change the key and value properties to lower case to be compatible with pep select component
    .onViewsMenuChanged(viewsMenu => {
        this.viewsMenu = {
            Visible: viewsMenu.Visible,
            Items: viewsMenu.Items.map(view => {
                return {
                    key: view.Key,
                    value: view.Value
                }
            })
        }
    })
  }

  subscribeToStateChanges(){
    this.pepperiList.subscribeToStateChanges()
    .onPageIndexChanged(index => this.$pageIndex.next(index))
    .onPageSizeChanged(size => this.$pageSize.next(size))
    .onPageTypeChanged(type => this.$pageType.next(type))
    .onSearchStringChanged(str => this.$searchString.next(str))
    .onSortingChanged(sorting => this.$sorting.next(sorting))
    .onViewKeyChanged(key => this.selectedViewKey = key)
  }

  onClientMenuClick(key: string){
    this.pepperiList.onMenuClick(key)
  }
  onViewChanged(key: string){
    this.pepperiList.onViewChanged(key)
  }

}
