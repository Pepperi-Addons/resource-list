import { ListContainer } from "shared";
import { ViewBlocksAdapter } from "./view-blocks-adapter";
import { DataSource } from "./data-source";
import { MenuDataView, SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { GenericListAdapterResult, SmartSearchField, SmartSearchInput } from "../metadata";

export class GenericListAdapter {
    constructor(private listContainer: Partial<ListContainer>){

    }
    adapt(): GenericListAdapterResult{
        const dataSource = this.getDataSource()
        const smartSearch = this.getSmartSearch()
        return {
            dataSource: dataSource,
            smartSearch: smartSearch
        }
    }
    /**
     * if the view blocks of the selected view are changed,
     * or that the data itself changed return dataSource otherwise return undefined
     */
    getDataSource(): DataSource | undefined{
        //first we can set the data and then update the dataview if needed
        if(this.listContainer.Layout?.View){
            const viewBlocksAdapter = new ViewBlocksAdapter(this.listContainer.Layout.View.ViewBlocks.Blocks)
            const dataview = viewBlocksAdapter.adapt()
            return new DataSource(dataview)
        }
        return undefined
    }
    getSmartSearch(): SmartSearchInput | undefined{
        if(this.listContainer.Layout?.SmartSearch){
            return {
                dataView: {
                    Type: 'Menu',
                    Fields: this.listContainer.Layout.SmartSearch.Fields
                }
            }
        }
        return undefined
    }
}