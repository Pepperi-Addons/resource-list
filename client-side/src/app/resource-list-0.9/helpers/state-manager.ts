import { IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { ListState } from "shared";
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


    buildChangesFromPageParams(params: IPepGenericListParams){
        const changes: Partial<ListState> = {}
        const pager = this.getPageIndexAndPageSize(params)
        //if search string changed
        if(params.searchString != this.state.SearchString){
            changes.SearchString = params.searchString || ''
        }

        //if page index changed
        if(pager?.pageIndex != this.state.PageIndex){
            changes.PageIndex = pager?.pageIndex || 1
        }
        //if page size changed
        if(pager?.pageSize != this.state.PageSize){
            changes.PageSize = pager?.pageSize || 25
        }

        //if sorting changed
        if(params.sorting?.isAsc !=  this.state.Sorting?.Ascending || params.sorting?.sortBy != this.state.Sorting?.FieldID){
            changes.Sorting = {
                Ascending: params.sorting.isAsc,
                FieldID: params.sorting?.sortBy
            }
        }
        return changes
    }

    private getPageIndexAndPageSize(params: IPepGenericListParams){
        if(params.fromIndex != undefined && params.toIndex != undefined){
            const pageSize = params.toIndex - params.fromIndex + 1
            return {
                pageIndex: Math.floor((params.fromIndex / pageSize || 1)) + 1 || 0,
                pageSize: pageSize
            }
        }
        if(params.pageIndex != undefined){
            return {
                pageIndex: params.pageIndex,
                pageSize: this.state.PageSize || 25 //25 by default
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