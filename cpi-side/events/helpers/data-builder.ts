import { JSONFilter, JSONRegularFilter, concat, toApiQueryString } from "@pepperi-addons/pepperi-filters";
import { List, ListSearchField, ListView as View, ListData, ListState } from "shared"
import { SearchBody } from "@pepperi-addons/papi-sdk";
import { ResourceService } from "../services/resource.service";
import { ViewRelationService } from "../services/view-relation.service";
import * as _ from 'lodash';

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
        
        //prepare the search body
        const viewFields: string[] = selectedView.Blocks.map(block => block.Configuration.FieldID)
        const query = this.createQuery(this.list.Filter)

        const searchBody: SearchBody = {
            Fields: viewFields,
            Where: query,
            Page: this.state?.PageIndex || 1,
            PageSize: this.state?.PageSize || 100,
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

    private isDataNeedsToChange(): boolean{
        return this.changes.ListKey != this.state.ListKey ||
            this.changes.ViewKey != this.changes.ViewKey || 
            this.changes.SearchString != this.state.SearchString || 
            _.isEqual(this.changes.SmartSearchQuery || [], this.state.SmartSearchQuery || []) || 
            this.changes.PageIndex != this.state.PageIndex
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
        return searchFields.map(searchField => `${searchField.FieldID} LIKE '%${this.state.SearchString}%'`).join(' OR ')
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