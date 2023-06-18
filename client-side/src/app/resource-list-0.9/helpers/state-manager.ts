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

    constructor(){
    }

    getStateObserver(){
        return this.stateObserver
    }

    notifyObservers(state: Partial<ListState>){
        this.stateObserver.notifyObservers(state || {})
    }


    buildChangesFromPageParams(params: IPepGenericListParams, smartSearchFields: ListSmartSearchField[], state: Partial<ListState>){
        const changes: Partial<ListState> = {}
        const pager = this.getPageIndexAndPageSize(params, state)
        //if search string has been deleted or changed
        if((params.searchString || state.SearchString) && params.searchString != state.SearchString){
            changes.SearchString = params.searchString || ''
        }

        //if page index changed
        if(pager?.pageIndex != state.PageIndex){
            changes.PageIndex = pager?.pageIndex || 0
        }
        //if page size changed
        if(pager?.pageSize != state.PageSize){
            changes.PageSize = pager?.pageSize || 100
        }

        //if sorting changed
        if(params.sorting && (params.sorting.isAsc !=  state.Sorting?.Ascending || params.sorting.sortBy != state.Sorting?.FieldID)){
            changes.Sorting = {
                Ascending: params.sorting.isAsc,
                FieldID: params.sorting.sortBy
            }
        }

        const stateSmartSearch = state.SmartSearchQuery
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

    private getPageIndexAndPageSize(params: IPepGenericListParams, state: Partial<ListState>){
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
                pageSize: state.PageSize || 100 //100 by default
            }
        }
        return undefined
    }
}