import { Component, OnInit } from '@angular/core';
import { ClientEventsService } from '../services/client-events.service';
import { IPepGenericListDataSource } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { GVButton, SmartSearchInput } from '../metadata';
import { PepMenuItem } from '@pepperi-addons/ngx-lib/menu';
import { StateManager } from '../helpers/state-manager';
import { PepperiList } from '../helpers/pepperi-list';
import { ListContainer, Sorting } from 'shared';
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
  lineMenu: any = {get: () => {}}
  dataSource: IPepGenericListDataSource
  loadCompleted: boolean = false
  search: boolean
  title: string
  selectionType: PepListSelectionType
  

  pageIndex: ReplaySubject<number> = new ReplaySubject()
  searchString: ReplaySubject<string> = new ReplaySubject()
  sorting: ReplaySubject<IPepListSortingChangeEvent> = new ReplaySubject()
  //subjects for state
  
  constructor(private clientEventService: ClientEventsService) { }

  ngOnInit(): void {
    this.load()
  }

  async load(){
    const container = await this.clientEventService.emitLoadListEvent(undefined,{ListKey: "LIST_KEY", SearchString: 'aa'}) as Required<ListContainer>
    this.pepperiList = new PepperiList(this.clientEventService, container)
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
    .onButtonsChanged((buttons: GVButton[]) => this.buttons = buttons)
    .onMenuChanged((menu: PepMenuItem[]) => this.menu = menu)
    .onLineMenuChanged((lineMenu) => this.lineMenu = lineMenu)
    .onSmartSearchChanged(data => this.smartSearch = data)
    .onSearchChanged(visible => this.search = visible)
    .onTitleChanged(title => this.title = title)
    .onSelectionTypeChanged(selectionType => {
      this.selectionType = selectionType
    })
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
