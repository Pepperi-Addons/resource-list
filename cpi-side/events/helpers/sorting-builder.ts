import { List, ListSearch, ListState, Sorting } from "shared";
import { Builder } from "./abstract-builder";

export class SortingBuilder extends Builder<Sorting>{

    constructor(){
        super()
    }
    /**
     * 
     * @param list - the current list configuration
     * @param state - the current state of the list
     * @param changes - the current changes of the list
     * @returns sorting object if and only if the sorting needs to be re rendered, otherwise returns null. 
     * if the sorting is not configured this function will return the default sorting: {Ascending: false, FieldID: 'CreationDateTime'}
     */
    build(list: List, state: Partial<ListState> | undefined, changes: Partial<ListState>): Sorting | null{
        const sorting = list.Sorting || {Ascending: false, FieldID: 'CreationDateTime'}
        return changes.ListKey ? sorting : null
    }


    
}