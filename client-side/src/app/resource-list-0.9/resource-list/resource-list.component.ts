import { Component, OnInit } from '@angular/core';
import { ClientEventsService } from '../services/client-events.service';
import { ViewBlocksAdapter } from '../helpers/view-blocks-adapter';
import { ListContainer } from 'shared';
import { IPepGenericListDataSource, IPepGenericListInitData, IPepGenericListParams } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { GridDataView } from '@pepperi-addons/papi-sdk';
import { GenericListAdapter } from '../helpers/generic-list-adapter';
import { GenericListAdapterResult, SmartSearchInput } from '../metadata';

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
  smartSearch: SmartSearchInput
  constructor(private clientEventService: ClientEventsService) { }

  ngOnInit(): void {
    this.init()
    
  }
  
  async init(){
    const listContainer  =  await this.clientEventService.emitLoadListEvent("LIST_KEY") as ListContainer
    if(listContainer){
      const genericListAdapter = new GenericListAdapter(listContainer)
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
  }

}
