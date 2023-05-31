import { List, ListSearch, ListState, SelectionType } from "shared";
import { Builder } from "./abstract-builder";

export class SelectionTypeBuilder extends Builder<SelectionType>{

    constructor(){
        super()
    }
    /**
     * 
     * @param list - the current list configuration
     * @param state - the current state of the list
     * @param changes - the current changes of the list
     * @returns the selectionType if and only if the selection type needs to be re rendered, otherwise returns null.
     * in case of no selection type configured its will return the default value of selection type.
     */
    build(list: List, state: Partial<ListState> | undefined, changes: Partial<ListState>): SelectionType | null{
        return changes.ListKey != undefined ? list.SelectionType || "Single" : null
    }


    
}