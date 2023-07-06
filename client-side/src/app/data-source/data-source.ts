import { IPepGenericListDataSource, IPepGenericListInitData, IPepGenericListListInputs, IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { AddonData, GridDataViewColumn, SearchData } from "@pepperi-addons/papi-sdk";
import { IPepListSortingChangeEvent } from "@pepperi-addons/ngx-lib/list";
import { ListOptions } from "../generic-viewer/generic-viewer.model";

export interface ItemsDataSource {
  getItems(params: IPepGenericListParams): Promise<SearchData<AddonData>>
}

export class StaticItemsDataSource implements ItemsDataSource {

  constructor (private items: any[], private searchCB: (str: string, items: any[]) => any[]) {

  }

  async getItems(params: IPepGenericListParams): Promise<SearchData<AddonData>> {
      let items = this.items;

      if (params.searchString) {
        items = this.searchCB(params.searchString, items);
      }

      return {
        Objects: items,
        Count: items.length
      };
  }
}

export class DynamicItemsDataSource implements ItemsDataSource {

  constructor (private func: (params: IPepGenericListParams) => Promise<SearchData<AddonData>>) {}

  async getItems(params: IPepGenericListParams): Promise<SearchData<AddonData>> {
      return this.func(params)
  }
}

export class DataSource implements IPepGenericListDataSource{
  private items: SearchData<AddonData> = {
    Objects: [],
    Count: 0
  }
  itemsDataSource: ItemsDataSource;
  inputs?: IPepGenericListListInputs;

    constructor(itemsDataSource: ItemsDataSource | AddonData[], private fields: any[], private widthArray: GridDataViewColumn[] = [], private searchCB = (str, items) => items, private listOptions?: ListOptions){
      this.itemsDataSource = Array.isArray(itemsDataSource) ? new StaticItemsDataSource(itemsDataSource, searchCB) : itemsDataSource;
      this.inputs = {
        selectionType: this.listOptions?.selectionType || 'single',
      }
    }

    getItemsCount(): number {
      return this.items.Count || 0;
    }
    
    async init(params: IPepGenericListParams): Promise<IPepGenericListInitData> {
      
      this.items = await this.itemsDataSource.getItems(params)
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
          totalCount: this.items.Count && this.items.Count > -1 ? this.items.Count : this.items.Objects.length,
          items: this.items.Objects,
        }; 
    }

    async update (params: IPepGenericListParams) {
      return (await this.itemsDataSource.getItems(params)).Objects;
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