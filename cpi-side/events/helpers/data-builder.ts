import { JSONFilter, JSONRegularFilter, concat, toApiQueryString } from "@pepperi-addons/pepperi-filters";
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
        //we should always ask for key also
        viewFields.push('Key')

        const query = this.createQuery(newState,this.list.Filter)

        const searchBody: SearchBody = {
            Fields: viewFields,
            Where: query,
            Page: newState.PageIndex || 0,
            PageSize: newState.PageSize || 25,
            IncludeCount: true
        }
        //get the resource items
        const genericResourceService = new ResourceService()
        const items = await genericResourceService.search(this.list.Resource, searchBody)
        const viewRelationService = new ViewRelationService()
        const viewRows = await viewRelationService.getRows(items, selectedView.Blocks)
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
        if(state.SmartSearchQuery && state.SmartSearchQuery.length > 0){
            queryArray.push(`(${this.buildSmartSearchQuery(state.SmartSearchQuery)})`)
        }
        if(filter){
            queryArray.push(`(${toApiQueryString(filter)})`)
        }
        return queryArray.join(' AND ')
    }

    private buildSearchQuery(state: Partial<ListState>, searchFields: ListSearchField[]){
        return searchFields.map(searchField => `${searchField.FieldID} LIKE '%${state.SearchString}%'`).join(' OR ')
    }

    private buildSmartSearchQuery(smartSearch: JSONRegularFilter[]): string{
        if(smartSearch.length == 0){
            return ''
        }
        //make a copy because we are changing the array
        const smartSearchCopy = JSON.parse(JSON.stringify(smartSearch))
        
        const firstFilter = smartSearchCopy.pop() as JSONRegularFilter
        const jsonFilter = concat(true, firstFilter, ...smartSearchCopy)
        return toApiQueryString(jsonFilter) || ''
    }  

}