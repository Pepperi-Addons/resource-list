import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SmartSearchInput } from '../../metadata';
import { IPepMenuItemClickEvent, PepMenuItem } from '@pepperi-addons/ngx-lib/menu';
import { GVButton } from '../../metadata'
import { ListDataSource } from '../../helpers/list-data-source';
import { PepListSelectionType } from '@pepperi-addons/ngx-lib/list';
import { GenericListComponent } from '@pepperi-addons/ngx-composite-lib/generic-list';

@Component({
  selector: 'list-ui',
  templateUrl: './list-ui.component.html',
  styleUrls: ['./list-ui.component.scss']
})
export class ListUIComponent implements OnInit {
   @Input() dataSource: ListDataSource
   smartSearch: SmartSearchInput = {dataView: {Type: "Menu", Fields: []}}
   menu: PepMenuItem[] = []
   buttons: GVButton[] = [] 
   lineMenu: any = {get: () => {}}
   loadCompleted: boolean = false
   search: boolean = false
   title: string
   selectionType: PepListSelectionType

   //generic list instance
   @ViewChild(GenericListComponent) list: GenericListComponent

  constructor() { }

  init(){
    this.dataSource.subscribeToLayoutChanges()
    .onButtonsChanged(data => this.buttons = data)
    .onLineMenuChanged(data => this.lineMenu = data)
    .onMenuChanged(data => this.menu = data)
    .onSmartSearchChanged(data => this.smartSearch = data)
    .onSearchChanged(visible => this.search = visible)
    .onTitleChanged(title => this.title = title)
    .onSelectionTypeChanged(selectionType => this.selectionType = selectionType)

    this.dataSource.subscribeToStateChanges()
    .onSearchStringChanged((data) => this.list.searchString = data)
    .onPageIndexChanged((data) => {
      const index = !isNaN(this.list.pager?.index) ? this.list.pager.index : 1
      this.list.pager.index = index
    })
    this.loadCompleted = true

  }
  ngOnInit(): void {
    this.init()
  }

  async onMenuClicked(event: IPepMenuItemClickEvent){
    const newDataSource = await this.dataSource.onMenuClick(event.source.key)
    this.dataSource = newDataSource
  }

}
