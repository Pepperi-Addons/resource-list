import { List, ListSearch, ListState, Search } from "shared";

export class SearchBuilder{

    constructor(){}
    /**
     * 
     * @param list - the current list configuration
     * @param state - the current state of the list
     * @param changes - the current changes of the list
     * @returns true/false according to if search bar should be visible, returns null if search bar should not be rendered
     */
    build(list: List, state: Partial<ListState> | undefined, changes: Partial<ListState>): Search | null{
        const searchFields = list.Search?.Fields || []
        return changes.ListKey != undefined ? {Visible: searchFields.length > 0 } : null
    }


    
}