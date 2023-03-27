import { IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { AddonDataScheme } from "@pepperi-addons/papi-sdk";
import { JSONRegularFilter } from "@pepperi-addons/pepperi-filters";
import { ListState } from "shared";
import { NgXToJSONFilterAdapter } from "./smart-filters/ngx-to-json-filters-adapter";
import { StateObserver } from "./state-observer";

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


    buildChangesFromPageParams(params: IPepGenericListParams, resourceFields: AddonDataScheme['Fields']){
        const changes: Partial<ListState> = {}
        //if search string changed
        if(params.searchString != this.state.SearchString){
            changes.SearchString = params.searchString || ''
        }
        //if page index changed
        if(params.pageIndex != this.state.PageIndex){
            changes.PageIndex = params.pageIndex || 0
        }

        //if sorting changed
        if(params.sorting?.isAsc !=  this.state.Sorting?.Ascending || params.sorting?.sortBy != this.state.Sorting?.FieldID){
            changes.Sorting = {
                Ascending: params.sorting.isAsc,
                FieldID: params.sorting?.sortBy
            }
        }

        //update smart search if changed
        const stateSmartSearch = this.state.SmartSearchQuery || []
        const listSmartSearch = NgXToJSONFilterAdapter.adapt(params.filters, resourceFields)

        if(this.isSmartSearchChanged(listSmartSearch, stateSmartSearch)){
            changes.SmartSearchQuery = listSmartSearch
        }

        return changes
    }


    private isSmartSearchChanged(listSmartSearch: JSONRegularFilter[], stateSmartSearch: JSONRegularFilter[]){
        if(listSmartSearch.length != stateSmartSearch.length){
            return true
        }

        return listSmartSearch.every((filter, index) => {
            const stateFilter = stateSmartSearch[index]
            return filter.ApiName != stateFilter.ApiName || 
                filter.FieldType != stateFilter.FieldType ||
                filter.Operation != stateFilter.Operation || 
                filter.Values.length != stateFilter.Values?.length ||
                filter.Values.every((val, i) => val != stateFilter.Values[i])
        })
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