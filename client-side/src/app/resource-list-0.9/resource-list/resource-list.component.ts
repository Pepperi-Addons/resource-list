import { Component, OnInit } from '@angular/core';
import { ClientEventsService } from '../services/client-events.service';
import { GridViewBlockAdapter } from '../helpers/view-blocks-adapter';
import { ListContainer } from 'shared';
import { IPepGenericListDataSource, IPepGenericListInitData, IPepGenericListParams } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { GenericListAdapter } from '../helpers/generic-list-adapter';
import { GVButton, GenericListAdapterResult, SmartSearchInput } from '../metadata';
import { PepMenuItem } from '@pepperi-addons/ngx-lib/menu';
import { Subject } from 'rxjs';
import { StateManager } from '../helpers/state-manager';
import { RLDataSource } from '../helpers/RL-data-source';

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
    this.load()
    
    
  }

  async load(){
    const state = new StateManager(undefined, {ListKey: "LIST_KEY"})
    this.dataSource = new RLDataSource(this.clientEventService, state)
  }

  onClientMenuClick(key: string, data?: any){
    console.log('menu clicked!!')
  }

}
