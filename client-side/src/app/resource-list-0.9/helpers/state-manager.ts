import { IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { ListState } from "shared";

export class StateManager{

    constructor(private state: Partial<ListState>, private changes: Partial<ListState>){

    }

    buildChangesFromPageParams(params: IPepGenericListParams){
        //if search string changed
        if(params.searchString != this.state.SearchString){
            this.changes.SearchString = params.searchString 
        }
        //if page index changed
        if(params.pageIndex != this.state.PageIndex){
            this.changes.PageIndex = params.pageIndex
        }
        //if sorting changed
        if(params.sorting?.isAsc !=  this.state.Sorting?.Ascending || params.sorting?.sortBy != this.state.Sorting?.FieldID){
            this.changes.Sorting = {
                Ascending: params.sorting.isAsc,
                FieldID: params.sorting?.sortBy
            }
        }
        return this.changes

    }
    setState(state: Partial<ListState>){
        this.state = state
    }
    getState(){
        return this.state
    }
    resetChanges(){
        this.changes = {}
    }
}