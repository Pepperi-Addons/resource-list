import { Component, OnInit } from '@angular/core';
import { ClientEventsService } from '../services/client-events.service';
import { IPepGenericListDataSource } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { GVButton, SmartSearchInput } from '../metadata';
import { PepMenuItem } from '@pepperi-addons/ngx-lib/menu';
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
