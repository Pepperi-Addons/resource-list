import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SmartSearchInput } from '../../metadata';
import { PepMenuItem } from '@pepperi-addons/ngx-lib/menu';
import { GVButton } from 'src/app/generic-viewer/generic-viewer.model';
import { RLDataSource } from '../../helpers/RL-data-source';
import { PepListSelectionType } from '@pepperi-addons/ngx-lib/list';

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
   search: boolean = false
   title: string
   selectionType: PepListSelectionType

  constructor() { }

  init(){
    this.dataSource.subscribe()
    .onButtonsChanged(data => this.buttons = data)
    .onLineMenuChanged(data => this.lineMenu = data)
    .onMenuChanged(data => this.menu = data)
    .onSmartSearchChanged(data => this.smartSearch = data)
    .onSearchChanged(visible => this.search = visible)
    .onTitleChanged(title => this.title = title)
    .onSelectionTypeChanged(selectionType => this.selectionType = selectionType)
    this.loadCompleted = true

  }
  ngOnInit(): void {
    this.init()
  }

}
