import { List, ListState } from "shared";
import { defaultStateValues } from "../metadata";

export class StateBuilder{

    constructor(private list: List,private state: Partial<ListState>,  private changes: Partial<ListState>){
        
    }

    build(): Partial<ListState> | undefined{
        //deep copy to not effect the changes object
        const state = JSON.parse(JSON.stringify(this.changes)) as Partial<ListState>

        /**
         * in case we changed a list or a view:
         *  1. clear the selected items.
         *  2. reset the scroll position
         *  3. reset page index if no changes in page index
        */
        if((this.changes.ViewKey || this.changes.ListKey)){
            state.ItemSelection = this.changes.ItemSelection || {SelectAll: false, Items: []}
            state.TopScrollIndex = this.changes.TopScrollIndex || 0
            state.PageIndex = this.changes.PageIndex || 1
        }
        return state
    }
}