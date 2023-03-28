import { IPepGenericListDataSource, IPepGenericListInitData, IPepGenericListListInputs, IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { GridDataViewColumn } from "@pepperi-addons/papi-sdk";
import { IPepListSortingChangeEvent } from "@pepperi-addons/ngx-lib/list";
import { ListOptions } from "../generic-viewer/generic-viewer.model";

export interface ItemsDataSource {
  getItems(params: IPepGenericListParams): Promise<{
    items: any[];
    totalCount: number
  }>
}

export class StaticItemsDataSource implements ItemsDataSource {

  constructor (private items: any[], private searchCB: (str: string, items: any[]) => any[]) {

  }

  async getItems(params: IPepGenericListParams): Promise<{ items: any[]; totalCount: number; }> {
      let items = this.items;

      if (params.searchString) {
        items = this.searchCB(params.searchString, items);
      }

      return {
        items: items,
        totalCount: items.length
      };
  }
}

export class DynamicItemsDataSource implements ItemsDataSource {

  constructor (private func: (params: IPepGenericListParams) => Promise<{ items: any[]; totalCount: number; }>) {}

  async getItems(params: IPepGenericListParams): Promise<{ items: any[]; totalCount: number; }> {
      return this.func(params)
  }
}

export class DataSource implements IPepGenericListDataSource{
  private items: any[] = []
  itemsDataSource: ItemsDataSource;
  inputs?: IPepGenericListListInputs;

    constructor(itemsDataSource: ItemsDataSource | any[], private fields: any[], private widthArray: GridDataViewColumn[] = [], private searchCB = (str, items) => items, private listOptions?: ListOptions){
      this.itemsDataSource = Array.isArray(itemsDataSource) ? new StaticItemsDataSource(itemsDataSource, searchCB) : itemsDataSource;
      this.inputs = {
        selectionType: this.listOptions?.selectionType || 'single',
      }
    }
    
    async init(params: IPepGenericListParams): Promise<IPepGenericListInitData> {
      
      const result = await this.itemsDataSource.getItems(params)
      this.items = result.items
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
          totalCount: result.items.length,
          items: result.items,
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