import { JSONFilter, JSONRegularFilter, concat, toApiQueryString } from "@pepperi-addons/pepperi-filters";
import { List } from "../../models/configuration/list.model";
import { ListSearchField, ListSmartSearch } from "../../models/configuration/search.model";
import { View, ViewBlock } from "../../models/configuration/view.model";
import { ListData } from "../../models/events/list-data.model";
import { ListState } from "../../models/events/list-state.model";
import { SearchBody } from "@pepperi-addons/papi-sdk";

import { ResourceService } from "../services/resource.service";
import { GridViewRelationService } from "../services/grid-view-relation.service";

export class ListDataBuilder{
    private listData: ListData = { Items: [], Count: 0}
    constructor(private list: List, private state: Partial<ListState>, private changes: Partial<ListState>){}

    async build(): Promise<ListData | undefined>{

        if(!this.isDataNeedsToChange()){
            return undefined
        }
        const selectedView = this.getSelectedView()
        if(!selectedView){
            return { Items: [], Count: 0 }
        }

        const viewFields: string[] = selectedView.Blocks.map(block => block.Configuration.FieldID)
        const query = this.createQuery(this.list.Filter)

        const searchBody: SearchBody = {
            Fields: viewFields,
            Where: query,
            Page: this.state?.PageIndex || 1,
            PageSize: this.state?.PageSize || 100,
            IncludeCount: true
        }
        const genericResourceService = new ResourceService()
        const items = await genericResourceService.searchFields(this.list.Resource, searchBody)
        const gridRelationService = new GridViewRelationService()
        const grid = await gridRelationService.getGridRows(items, selectedView.Blocks, this.list.Resource)
        this.listData = {Items: grid, Count: items.Count}
        return this.listData
    }

    private isDataNeedsToChange(): boolean{
        return Boolean(this.changes.ListKey || this.changes.ViewKey || this.changes.SearchString || this.changes.SmartSearchQuery || this.changes.PageIndex)
    }

    private getSelectedView(): View | undefined{
        const viewKey = this.state?.ViewKey
        const selectedView = this.list.Views.find(view => view.Key == viewKey)
        if(!selectedView && this.list.Views.length > 0){
            return this.list.Views[0]
        }
        return selectedView
    }
    
    private createQuery(filter?: JSONFilter): string{
        let queryArray: string[] = []
        if(this.state.SearchString && this.list.Search.Fields.length > 0){
            queryArray.push(`(${this.buildSearchQuery(this.list.Search.Fields)})`)
        }
        if(this.state.SmartSearchQuery && this.state.SmartSearchQuery.length > 0){
            queryArray.push(`(${this.buildSmartSearchQuery(this.state.SmartSearchQuery)})`)
        }
        if(filter){
            queryArray.push(`(${toApiQueryString(filter)})`)
        }
        return queryArray.join(' AND ')
    }

    private buildSearchQuery(searchFields: ListSearchField[]){
        return searchFields.map(searchField => `${searchField} LIKE '%${this.state.SearchString}%'`).join(' OR ')
    }

    private buildSmartSearchQuery(smartSearch: JSONRegularFilter[]): string{
        if(smartSearch.length == 0){
            return ''
        }
        const firstFilter = smartSearch.pop() as JSONRegularFilter
        const jsonFilter = concat(true, firstFilter, ...smartSearch)
        return toApiQueryString(jsonFilter) || ''
    }  

}