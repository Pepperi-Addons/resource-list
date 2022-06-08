import { IPepGenericListDataSource, IPepGenericListInitData, IPepGenericListListInputs } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { TranslateService } from '@ngx-translate/core';
import { GridDataViewColumn } from "@pepperi-addons/papi-sdk";
import { IPepListSortingChangeEvent } from "@pepperi-addons/ngx-lib/list";

export class DataSource implements IPepGenericListDataSource{
    inputs?: IPepGenericListListInputs = 
    {
      pager:{
      type: 'scroll'
      },
    }
  selectionType: 'multi'
    constructor(private items: any[], private fields: any[], private widthArray: GridDataViewColumn[] = []){
    }
    async init(params: { searchString?: string; filter?: any; sorting?: IPepListSortingChangeEvent; fromIndex: number; toIndex: number; }): Promise<IPepGenericListInitData> {
        return {
            dataView: {
              Context: {
                Name: '',
                Profile: { InternalID: 0 },
                ScreenSize: 'Landscape'
              },
              Type: 'Grid',
              
              Title: 'Block',
              Fields: this.fields,
              Columns: this.widthArray,
              FrozenColumnsCount: 0,
              MinimumColumnWidth: 0
            },
            totalCount: this.items.length,
            items: this.items
          }; 
    }
}