import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ClientEventsService, ICPIEventsService } from '../services/client-events.service';
import { IPepGenericListActions, IPepGenericListDataSource, IPepGenericListEmptyState, IPepGenericListPager, IPepGenericListParams } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { GVButton, SmartSearchInput, ViewsMenuUI } from '../metadata';
import { PepMenuItem } from '@pepperi-addons/ngx-lib/menu';
import { PepperiList } from '../helpers/pepperi-list';
import { IPepListSortingChangeEvent, PepListSelectionType } from '@pepperi-addons/ngx-lib/list';
import { ReplaySubject } from 'rxjs';
import { ResourceService } from '../services/resources.service';
import { ListUIComponent } from './list-ui/list-ui.component';
import { ListContainer } from 'shared'

@Component({
  selector: 'resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss']
})

export class ResourceListComponent implements OnInit {
  @Input() listContainer: ListContainer
  @Input() cpiEventService: ICPIEventsService

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
  topScrollIndex: number
  $errorMsg: ReplaySubject<IPepGenericListEmptyState> = new ReplaySubject()
  
  //pager subjects
  $pageIndex: ReplaySubject<number> = new ReplaySubject()
  $pageSize: ReplaySubject<number> = new ReplaySubject()
  $pageType: ReplaySubject<IPepGenericListPager['type']> = new ReplaySubject()

  $searchString: ReplaySubject<string> = new ReplaySubject()
  $sorting: ReplaySubject<IPepListSortingChangeEvent> = new ReplaySubject()
  $selectAll: ReplaySubject<boolean> = new ReplaySubject()
  
  @ViewChild(ListUIComponent) list: ListUIComponent

  constructor() { }

  ngOnInit(): void {
    this.load()
  }

  async load(){
    if(!this.cpiEventService || (!this.listContainer?.State?.ListKey && this.listContainer?.List)){
        throw Error(`error in resource list ABI component - cpi events service must be exist, list container must have a list or a list key inside the state`)
    }
    const list = await this.cpiEventService.emitLoadListEvent(undefined, this.listContainer.State, this.listContainer.List)
    this.pepperiList = new PepperiList(this.cpiEventService, list)
    this.subscribeToChanges()
    this.lineMenu = this.pepperiList.getListActions()
    this.loadCompleted = true
  }

  subscribeToChanges(){
    this.pepperiList.subscribeToDataSource((ds: IPepGenericListDataSource) => this.dataSource = ds)
    this.pepperiList.subscribeToListActions((actions) => this.lineMenu = actions)
    this.subscribeToLayoutChanges()
    this.subscribeToStateChanges()
    this.pepperiList.subscribeToErrors(err => this.$errorMsg.next(err))
  }

  subscribeToLayoutChanges(){
    this.pepperiList.subscribeToLayoutChanges()
    .onButtonsChanged(buttons => this.buttons = buttons)
    .onMenuChanged(menu => this.menu = menu)
    .onSmartSearchChanged(data => this.smartSearch = data)
    .onSearchChanged(visible => this.search = visible)
    .onTitleChanged(title => this.title = title)
    .onSelectionTypeChanged(selectionType =>{this.selectionType = selectionType})
    // needs to change the key and value properties to lower case to be compatible with pep select component
    .onViewsMenuChanged(viewsMenu => {
        this.viewsMenu = {
            Visible: viewsMenu?.Visible,
            Items: viewsMenu?.Items.map(view => {
                return {
                    key: view.Key,
                    value: view.Value
                }
            }) || []
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
    .onSelectAllChanged(isAllSelected => this.$selectAll.next(isAllSelected))
    .onTopScrollIndexChanged(index => this.topScrollIndex = index)
  }

  onClientMenuClick(key: string){
    this.pepperiList.onMenuClick(key)
  }
  onViewChanged(key: string){
    this.pepperiList.onViewChanged(key)
  }

  getSelectedItems(){
    return this.list?.getSelectedItems()
  }

  onTopScrollIndexChanged(index: number){
    this.pepperiList.setTopScrollIndex(index)
  }

}
