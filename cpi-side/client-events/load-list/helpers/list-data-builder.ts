import { JSONFilter, toApiQueryString } from "@pepperi-addons/pepperi-filters";
import { List } from "../../../lists/models/list.model";
import { ListState } from "../../models/list-state.model";
import { ListData, ListLayout, ViewLayout } from "../models/list-model.model";
import { SearchBody } from "@pepperi-addons/papi-sdk";
import { GenericResourceService } from "../../../services/generic-resource.service";
import { GridCell, getCellBlock } from "../../utils/utils";
import { ListSearchField } from "../../../lists/models/search.model";

export interface IListDataBuilder{
    build(): Promise<ListData>
}

export class ListDataBuilder{
    private listData: ListData = { Items: []}

    constructor( private list: List, private prevState,  private currState: ListState){
        
    }

    private getSelectedView(): View | undefined{
        const viewKey = this.currState.ViewKey
        const selectedView = this.list.Views.find(view => view.Key == viewKey)
        if(!selectedView && this.list.Views.length > 0){
            return this.list.Views[0]
        }
        return selectedView
    }

    private getSearchFields(viewBlocks: ViewBlock[]){
        //get the fields in order to search the items
        const fields: string[] = viewBlocks.map(viewBlock => viewBlock.Configuration.FieldID) as string[]
        //add key if missing
        if(!fields.includes('Key')){
            fields.push('Key')
        }
        return fields
    }
    
    async build(): Promise<ListData>{
        //get view blocks
        const selectedView = this.getSelectedView()
        if(!selectedView){
            this.listData = { Items: [] }
        }
        const searchFields = this.list.Search.Fields
        const filter = this.list.Filter
        const query = this.createQuery(searchFields, filter)
        const viewBlocks = selectedView!.ViewBlocks
        //get the fields in order to search the items
        const fields: string[] = this.getSearchFields(viewBlocks)

        const searchBody: SearchBody = {
            Fields: fields,
            Where: query,
            Page: this.currState?.PageIndex,
            PageSize: this.currState?.PageSize,
            IncludeCount: true
        }
        const genericResourceService = new GenericResourceService()
        const items = await genericResourceService.searchItems(this.list.Resource, searchBody)

        const gridCellOutput = getCellBlock({Items: items.Objects, ViewBlocks: viewBlocks})
        const rows: GridCell[] = []
        gridCellOutput.GridData.map(gridRow => {
            //take the current row and convert it to an object
           const row = gridRow.reduce((acc, curr) => acc = {...acc, ...curr},{})
           rows.push(row)
        })
        this.listData.Items = rows
        return this.listData
    }

    private createQuery(searchFields: ListSearchField[], filter?: JSONFilter): string{
        let queryArray: string[] = []
        if(this.currState?.SearchString && searchFields.length > 0){
            queryArray.push(`(${this.buildSearchQuery(searchFields)})`)
        }
        if(this.currState?.SmartSearchQuery){
            queryArray.push(`(${toApiQueryString(this.currState.SmartSearchQuery)})`)
        }
        if(filter){
            queryArray.push(`(${toApiQueryString(filter)})`)
        }
        return queryArray.join(' AND ')
    }

    private buildSearchQuery(searchFields: ListSearchField[]){
        return searchFields.map(searchField => `${searchField} LIKE '%${this.currState?.SearchString}%'`).join(' OR ')
    }       
}