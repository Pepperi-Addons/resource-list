import { Component, Input, OnInit } from '@angular/core';
import { ClientEventsService, ICPIEventsService } from '../services/client-events.service';
import { IPepGenericListActions, IPepGenericListDataSource, IPepGenericListPager } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { GVButton, SmartSearchInput, ViewsMenuUI } from '../metadata';
import { PepMenuItem } from '@pepperi-addons/ngx-lib/menu';
import { PepperiList } from '../helpers/pepperi-list';
import { List, ListContainer, ListState } from 'shared';
import { IPepListSortingChangeEvent, PepListSelectionType } from '@pepperi-addons/ngx-lib/list';
import { ReplaySubject } from 'rxjs';
import { ResourceService } from '../services/resources.service';

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


  //pager subjects
  $pageIndex: ReplaySubject<number> = new ReplaySubject()
  $pageSize: ReplaySubject<number> = new ReplaySubject()
  $pageType: ReplaySubject<IPepGenericListPager['type']> = new ReplaySubject()

  $searchString: ReplaySubject<string> = new ReplaySubject()
  $sorting: ReplaySubject<IPepListSortingChangeEvent> = new ReplaySubject()




  
  constructor(private resourceService: ResourceService) { }

  ngOnInit(): void {
    this.load()
  }

  async load(){
    const container = await this.cpiEventService.emitLoadListEvent(undefined, this.listContainer.State, this.listContainer.List) as Required<ListContainer>
    const resource = this.listContainer?.List?.Resource
    if(!resource){
        throw Error(`there is no resource on list container list object`)
    }
    //get resource fields
    const resourceFields = await this.resourceService.getResourceFields(resource)
    this.pepperiList = new PepperiList(this.cpiEventService, container, resourceFields)
    this.subscribeToChanges()
    this.loadCompleted = true
  }

  subscribeToChanges(){
    this.pepperiList.subscribeToDataSource((ds: IPepGenericListDataSource) => this.dataSource = ds)
    this.pepperiList.subscribeToListActions((actions) => this.lineMenu = actions)
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
  }

  onClientMenuClick(key: string){
    this.pepperiList.onMenuClick(key)
  }
  onViewChanged(key: string){
    this.pepperiList.onViewChanged(key)
  }

}
