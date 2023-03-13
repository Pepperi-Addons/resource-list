import { Component, OnInit } from '@angular/core';
import { ClientEventsService } from '../services/client-events.service';
import { GridViewBlockAdapter } from '../helpers/view-blocks-adapter';
import { ListContainer } from 'shared';
import { IPepGenericListDataSource, IPepGenericListInitData, IPepGenericListParams } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { GenericListAdapter } from '../helpers/generic-list-adapter';
import { GVButton, GenericListAdapterResult, SmartSearchInput } from '../metadata';
import { PepMenuItem } from '@pepperi-addons/ngx-lib/menu';
import { Subject } from 'rxjs';

@Component({
  selector: 'resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss']
})
export class ResourceListComponent implements OnInit {
  dataSource: IPepGenericListDataSource
  smartSearch: SmartSearchInput
  menu: PepMenuItem[]
  buttons: GVButton[]
  lineMenu: any = {get: () => {}}
  constructor(private clientEventService: ClientEventsService) { }

  ngOnInit(): void {
    this.init()
    
  }
  
  async init(){
    const listContainer  =  await this.clientEventService.emitLoadListEvent("LIST_KEY") as ListContainer
    if(listContainer){
      const lineMenuSubject = new Subject<{key: string, data?: any}>()
      lineMenuSubject.subscribe((event) => this.onClientMenuClick(event.key, event.data))
      const genericListAdapter = new GenericListAdapter(listContainer, lineMenuSubject)
      const genericListData = genericListAdapter.adapt()
      this.setGenericListVariables(genericListData)
    }
  }
  /**
   * this function will update everything that changed in the list
   * @param data the output from the generic list adapter
   */
  setGenericListVariables(data: GenericListAdapterResult){
    this.dataSource = data.dataSource || this.dataSource
    this.smartSearch = data.smartSearch || this.smartSearch
    this.menu = data.menu || this.menu
    this.buttons = data.buttons || this.buttons
    this.lineMenu = data.lineMenu || this.lineMenu
  }

  onClientMenuClick(key: string, data?: any){
    console.log('menu clicked!!')
  }

}
