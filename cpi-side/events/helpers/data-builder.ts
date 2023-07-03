import { JSONFilter, toApiQueryString } from "@pepperi-addons/pepperi-filters";
import { List, ListSearchField, ListView as View, ListData, ListState } from "shared"
import { SearchBody } from "@pepperi-addons/papi-sdk";
import { ResourceService } from "../services/resource.service";
import { ViewRelationService } from "../services/view-relation.service";
import * as _ from 'lodash';

export class ListDataBuilder{
    private listData: ListData = { Items: [], Count: 0}
    constructor(private list: List, private state: Partial<ListState> = {}, private changes: Partial<ListState> = {}){}

    async build(): Promise<ListData | undefined>{
        if(!this.isDataNeedsToChange()){
            return undefined
        }
        //building the new state
        const newState = {...this.state, ...this.changes}

        const selectedView = this.getSelectedView(newState)

        if(!selectedView){
            return { Items: [], Count: 0 }
        }
        
        //prepare the search body
        const viewFields: string[] = selectedView.Blocks.map(block => block.Configuration.FieldID)
        //add key field if it doesn't exist
        const isKeyInViewFields = viewFields.find(viewField => viewField == "Key")
        if(!isKeyInViewFields){
            viewFields.push('Key')
        }

        /**
         * we always use sorting, but there is an hierarchy for who decide what the sorting will be this is the order were the 1 is the most significant 
         * 1. new state
         * 2. configuration 
         * 3. default 
        */
       const sorting = this.changes.Sorting || this.state.Sorting || this.list.Sorting || {FieldID: 'CreationDateTime', Ascending: false}
        const query = this.createQuery(newState,this.list.Filter)
        const searchBody: SearchBody = {
            Fields: viewFields,
            Where: query,
            Page: newState.PageIndex || 1,
            PageSize: newState.PageSize || 25,
            IncludeCount: true,
            OrderBy: `${sorting?.FieldID || 'CreationDateTime'} ${sorting?.Ascending ? 'asc': 'desc'}`
        }
        //get the resource items
        const genericResourceService = new ResourceService()
        const items = await genericResourceService.search(this.list.Resource, searchBody)
        //in case the number of the items is not known, return count = items.length
        if(items.Count == undefined || items.Count < 0){
            items.Count = items.Objects.length
        }
        const viewRelationService = new ViewRelationService()
        const viewRows = await viewRelationService.getRows(items, selectedView.Blocks, this.list.Resource)
        this.listData = {Items: viewRows, Count: items.Count}
        return this.listData
    }
    /**
     * decide if the data needs to be changed.
     * the data needs to be changed if at least on of the following properties:
     * list key, view key, search string, smart search query has changed or deleted
     * @returns 
     */
    private isDataNeedsToChange(): boolean{
        const changesKeySet= new Set(Object.keys(this.changes) as Array<keyof Partial<ListState>>)
        return changesKeySet.has("ListKey") ||
            changesKeySet.has("ViewKey") ||
            changesKeySet.has("SearchString") ||
            changesKeySet.has("SmartSearchQuery") ||
            changesKeySet.has("PageIndex") ||
            changesKeySet.has("PageSize")
    }

    private getSelectedView(state: Partial<ListState>): View | undefined{
        const viewKey = state.ViewKey
        const selectedView = this.list.Views.find(view => view.Key == viewKey)
        if(!selectedView && this.list.Views.length > 0){
            return this.list.Views[0]
        }
        return selectedView
    }
    
    private createQuery(state: Partial<ListState>, filter?: JSONFilter): string{
        let queryArray: string[] = []
        if(state.SearchString && this.list.Search.Fields.length > 0){
            queryArray.push(`(${this.buildSearchQuery(state, this.list.Search.Fields)})`)
        }
        if(state.SmartSearchQuery){
            queryArray.push(`(${toApiQueryString(state.SmartSearchQuery)})`)
        }
        if(filter){
            queryArray.push(`(${toApiQueryString(filter)})`)
        }
        return queryArray.join(' AND ')
    }

    private buildSearchQuery(state: Partial<ListState>, searchFields: ListSearchField[]){
        return searchFields.map(searchField => `${searchField.FieldID} LIKE '%${state.SearchString}%'`).join(' OR ')
    }
}