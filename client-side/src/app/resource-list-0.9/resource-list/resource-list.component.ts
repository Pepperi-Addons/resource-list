import { Component, OnInit } from '@angular/core';
import { ClientEventsService } from '../services/client-events.service';
import { ViewBlocksAdapter } from '../helpers/view-blocks-adapter';
import { ListContainer } from 'shared';
import { IPepGenericListDataSource, IPepGenericListInitData, IPepGenericListParams } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { GridDataView } from '@pepperi-addons/papi-sdk';

@Component({
  selector: 'resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss']
})
export class ResourceListComponent implements OnInit {
  //default dataSource
  dataSource: IPepGenericListDataSource = {
    init: async function (params: IPepGenericListParams): Promise<IPepGenericListInitData> {
        return {
          dataView: {
            Type: "Grid",
            Fields: [],
            Columns: [],
            Context: {
              Name: '',
              Profile: { InternalID: 0 },
              ScreenSize: 'Landscape'
            }
          },
          totalCount: 0,
          items: []
        }
    }
  }
  constructor(private clientEventService: ClientEventsService) { }

  ngOnInit(): void {
    this.init()
    
  }
  
  async init(){
    const result  =  await this.clientEventService.emitLoadListEvent("LIST_KEY") as ListContainer
    if(result && result.Layout?.View){
      const viewBlocksAdapter = new ViewBlocksAdapter(result.Layout.View.ViewBlocks.Blocks)
      const dataview = viewBlocksAdapter.adapt()
      this.setDataSource(dataview)
    }
    
  }

  setDataSource(dataView: GridDataView = {Type: 'Grid'}){
    this.dataSource = {
      init: async function (params: IPepGenericListParams): Promise<IPepGenericListInitData> {
          return {
            dataView: dataView,
            totalCount: 0,
            items: []
          }
      }
    }
  }

}
