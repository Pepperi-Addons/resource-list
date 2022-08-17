import { IPepGenericListDataSource, IPepGenericListInitData, IPepGenericListTableInputs } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { GridDataViewColumn } from "@pepperi-addons/papi-sdk";
import { IPepListSortingChangeEvent } from "@pepperi-addons/ngx-lib/list";

export class DataSource implements IPepGenericListDataSource{
    inputs?: IPepGenericListTableInputs = 
    {
      pager:{
      type: 'scroll'
      },
      selectionType: 'multi'
    }

    constructor(private items: any[], private fields: any[], private widthArray: GridDataViewColumn[] = [], private searchCB = (str, items) => items ){
    }
    async init(params: { searchString?: string; filter?: any; sorting?: IPepListSortingChangeEvent; fromIndex: number; toIndex: number; }): Promise<IPepGenericListInitData> {
      const searchString = params?.searchString || ""
      const items = this.searchCB(searchString,this.items)
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
          totalCount: items.length,
          items: items
        }; 
    }
    getItems(){
      return this.items
    }
    getFields(){
      return this.fields
    }
    getColumns(){
      return this.widthArray
    }
}