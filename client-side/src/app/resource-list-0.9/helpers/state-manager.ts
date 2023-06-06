import { IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { AddonDataScheme } from "@pepperi-addons/papi-sdk";
import { JSONFilter, JSONRegularFilter, ngxFilterToJsonFilter } from "@pepperi-addons/pepperi-filters";
import { ListSmartSearchField, ListState } from "shared";
import { NgXToJSONFilterAdapter } from "./smart-filters/ngx-to-json-filters-adapter";
import { StateObserver } from "./state-observer";
import * as _ from "lodash";
import { SchemeFieldType } from "@pepperi-addons/papi-sdk/dist/entities";

export class StateManager{

    private stateObserver: StateObserver = new StateObserver()

    constructor(private state: Partial<ListState>){
    }

    getStateObserver(){
        return this.stateObserver
    }

    notifyObservers(){
        this.stateObserver.notifyObservers(this.state)
    }


    buildChangesFromPageParams(params: IPepGenericListParams, smartSearchFields: ListSmartSearchField[]){
        const changes: Partial<ListState> = {}
        const pager = this.getPageIndexAndPageSize(params)
        //if search string has been deleted or changed
        if((params.searchString || this.state.SearchString) && params.searchString != this.state.SearchString){
            changes.SearchString = params.searchString || ''
        }

        //if page index changed
        if(pager?.pageIndex != this.state.PageIndex){
            changes.PageIndex = pager?.pageIndex || 0
        }
        //if page size changed
        if(pager?.pageSize != this.state.PageSize){
            changes.PageSize = pager?.pageSize || 100
        }

        //if sorting changed
        if(params.sorting && (params.sorting.isAsc !=  this.state.Sorting?.Ascending || params.sorting.sortBy != this.state.Sorting?.FieldID)){
            changes.Sorting = {
                Ascending: params.sorting.isAsc,
                FieldID: params.sorting.sortBy
            }
        }

        const stateSmartSearch = this.state.SmartSearchQuery
        const listSmartSearch = this.getListSmartSearchFromParams(params, smartSearchFields)
        //update smart search if changed
        if(!_.isEqual(stateSmartSearch, listSmartSearch)){
            changes.SmartSearchQuery = listSmartSearch || null
        }
        return changes
    }

    getListSmartSearchFromParams(params: IPepGenericListParams,fields: ListSmartSearchField[]): JSONFilter | undefined{
        if(!params.filters){
            return undefined
        }
        //create the types object from the smart search configuration
        const types: {[key: string]: SchemeFieldType} = {}
        fields.forEach(field => {
            types[field.FieldID] = field.Type
        })
        return ngxFilterToJsonFilter(params.filters, types)
    }

    private getPageIndexAndPageSize(params: IPepGenericListParams){
        if(params.fromIndex != undefined && params.toIndex != undefined){
            const pageSize = params.toIndex - params.fromIndex + 1
            return {
                pageIndex: Math.ceil((params.toIndex / (pageSize || 1))) || 1,
                pageSize: pageSize
            }
        }
        if(params.pageIndex != undefined){
            return {
                pageIndex: params.pageIndex,
                pageSize: this.state.PageSize || 100 //100 by default
            }
        }
        return undefined
    }

    setState(state: Partial<ListState>){
        this.state = state
    }

    updateState(state: Partial<ListState>){
        this.state = {...(this.state || {}), ...state}
    }

    getState(){
        return this.state
    }
}