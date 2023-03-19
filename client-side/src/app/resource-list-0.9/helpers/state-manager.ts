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
        //if search string changed
        if(params.searchString != this.state.SearchString){
            changes.SearchString = params.searchString || ''
        }
        //if page index changed
        if(params.pageIndex != this.state.PageIndex){
            changes.PageIndex = params.pageIndex || 1
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