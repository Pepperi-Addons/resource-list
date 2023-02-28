import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IPepGenericListDataSource } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { GridDataView } from '@pepperi-addons/papi-sdk';
import { SmartSearchInput } from '../../metadata';
import { PepMenuItem } from '@pepperi-addons/ngx-lib/menu';
import { GVButton } from 'src/app/generic-viewer/generic-viewer.model';
import { RLManager } from '../../helpers/resource-list-manager';
import { RLDataSource } from '../../helpers/RL-data-source';

@Component({
  selector: 'list-ui',
  templateUrl: './list-ui.component.html',
  styleUrls: ['./list-ui.component.scss']
})
export class ListUIComponent implements OnInit {
   @Input() dataSource: RLDataSource
   smartSearch: SmartSearchInput = {dataView: {Type: "Menu", Fields: []}}
   menu: PepMenuItem[] = []
   buttons: GVButton[] = [] 
   lineMenu: any = {get: () => {}}
   loadCompleted: boolean = false

  constructor() { }

  init(){
    this.dataSource.subscribe()
    .onButtonsChanged((data) => this.buttons = data)
    .onLineMenuChanged((data) => this.lineMenu = data)
    .onMenuChanged((data) => this.menu = data)
    .onSmartSearchChanged((data) => this.smartSearch = data)
    this.loadCompleted = true

  }
  ngOnInit(): void {
    this.init()
  }

}
