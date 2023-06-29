import { List, ListState } from "shared";
import { defaultStateValues } from "../metadata";

export class StateBuilder{

    constructor(private list: List,private state: Partial<ListState>,  private changes: Partial<ListState>){
        
    }

    build(): Partial<ListState> | undefined{
        //deep copy to not effect the changes object
        const state = JSON.parse(JSON.stringify(this.changes)) as Partial<ListState>

        //in case we changed a list or a view and the selected items are not cleared, we need to clear the selected items, reset the scroll position 
        if((this.changes.ViewKey || this.changes.ListKey)){
            state.ItemSelection = {SelectAll: false, Items: []}
            state.TopScrollIndex = 0
        }
        return state
    }
}